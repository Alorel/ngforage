import {Rule, SchematicsException} from '@angular-devkit/schematics';
import {getProjectFromWorkspace, getProjectMainFile} from '@angular/cdk/schematics';
import {addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {InsertChange} from '@schematics/angular/utility/change';
import {getWorkspace} from '@schematics/angular/utility/config';
import {getAppModulePath} from '@schematics/angular/utility/ng-ast-utils';
import * as fs from 'fs';
import {dirname, join} from 'path';
import * as ts from 'typescript';
import {NgAddOptions} from './index';

const enum Strings {
  CFG_FILE = 'ngforage.config.ts'
}

/**
 * Finds a NgModule declaration within the specified TypeScript node and returns the
 * corresponding metadata for it. This function searches breadth first because
 * NgModule's are usually not nested within other expressions or declarations.
 */
function findNgModuleMetadata(rootNode: ts.Node): ts.ObjectLiteralExpression | null {
  // Add immediate child nodes of the root node to the queue.
  const nodeQueue = [...rootNode.getChildren()];

  while (nodeQueue.length) {
    const node = nodeQueue.shift()!;
    if (ts.isDecorator(node) && ts.isCallExpression(node.expression) &&
      isNgModuleCallExpression(node.expression)) {
      return node.expression.arguments[0] as ts.ObjectLiteralExpression;
    } else {
      nodeQueue.push(...node.getChildren());
    }
  }

  return null;
}

/** Whether the specified call expression is referring to a NgModule definition. */
function isNgModuleCallExpression(callExpression: ts.CallExpression): boolean {
  if (!callExpression.arguments.length || !ts.isObjectLiteralExpression(callExpression.arguments[0])) {
    return false;
  }

  const decoratorIdentifier = resolveIdentifierOfExpression(callExpression.expression);

  return decoratorIdentifier ? decoratorIdentifier.text === 'NgModule' : false;
}

/**
 * Resolves the last identifier that is part of the given expression. This helps resolving
 * identifiers of nested property access expressions (e.g. myNamespace.core.NgModule).
 */
function resolveIdentifierOfExpression(expression: ts.Expression): ts.Identifier | null {
  if (ts.isIdentifier(expression)) {
    return expression;
  } else if (ts.isPropertyAccessExpression(expression)) {
    return expression.name;
  }

  return null;
}

export function ngAddSetupProject(options: NgAddOptions): Rule {
  return (tree, context) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const modulePath = getAppModulePath(tree, getProjectMainFile(project));

    const moduleFileContent = tree.read(modulePath);
    if (!moduleFileContent) {
      throw new SchematicsException(`Could not read app module ${modulePath}`);
    }

    const appModule = ts.createSourceFile(
      modulePath,
      moduleFileContent.toString('utf8'),
      ts.ScriptTarget.Latest,
      true
    );
    const ngModuleMetadata = findNgModuleMetadata(appModule);
    if (!ngModuleMetadata) {
      throw new SchematicsException(`Could not find NgModule declaration inside: "${modulePath}"`);
    }

    const confPath = join(dirname(modulePath), Strings.CFG_FILE);

    if (!tree.exists(confPath)) {
      tree.create(confPath, fs.readFileSync(join(__dirname, 'files', Strings.CFG_FILE)));
    } else {
      context.logger.info('Skipping ngforage.config.ts - already exists');
    }

    const prov = addProviderToModule(appModule, modulePath, 'NGFORAGE_CONFIG_PROVIDER', './ngforage.config')
      .filter((v): v is InsertChange => v instanceof InsertChange);
    if (prov.length) {
      const recorder = tree.beginUpdate(modulePath);
      for (const p of prov) {
        recorder.insertLeft(p.pos, p.toAdd);
      }

      tree.commitUpdate(recorder);
    }
  };
}
