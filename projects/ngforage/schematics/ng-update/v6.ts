import {FileEntry, Rule, Tree, TypedSchematicContext, UpdateRecorder} from '@angular-devkit/schematics';
import {isImported} from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';
import {insertMetaEntry} from '../_common/insertMetaEntry';
import {loadAppModule} from '../_common/loadAppModule';

function migrateForRoot(
  appModule: ts.SourceFile,
  ngModuleMetadata: ts.ObjectLiteralExpression,
  recorder: UpdateRecorder
): boolean {
  let addWidth: number;
  let returnValue = false;

  const rmNode = (el: ts.Node) => {
    recorder.remove(el.pos, el.getFullWidth() + addWidth);
  };

  for (const property of ngModuleMetadata.properties) {
    if (
      !ts.isPropertyAssignment(property) ||
      property.name.getText() !== 'imports' ||
      !ts.isArrayLiteralExpression(property.initializer)
    ) {
      continue;
    }

    const elements = (property.initializer).elements;
    const maxIndex = elements.length - 1;
    for (let i = maxIndex; i > -1; i--) {
      const el = elements[i];
      addWidth = i === maxIndex ? 0 : 1;

      if (ts.isIdentifier(el)) {
        if (el.getText() === 'NgForageModule') {
          rmNode(el);
        }
      } else if (ts.isCallExpression(el)) {
        const access = el.expression;
        if (
          ts.isPropertyAccessExpression(access) &&
          access.expression.getText() === 'NgForageModule' &&
          access.name.getText() === 'forRoot'
        ) {
          const arg = el.arguments[0];
          if (arg) {
            let useValue: string = null as any;
            if (ts.isIdentifier(arg) || ts.isObjectLiteralExpression(arg) || ts.isAsExpression(arg)) {
              useValue = arg.getText();
            }

            if (useValue) {
              const provide = `{\n      provide: DEFAULT_CONFIG,\n      useValue: ${useValue}\n    }`;
              insertMetaEntry('providers', appModule, recorder, provide);
              returnValue = true;
            }
          }

          rmNode(el);
        }
      }
    }
  }

  return returnValue;
}

function migrateImports(file: ts.SourceFile, importCfg: boolean, recorder: UpdateRecorder) {
  const imports: ts.ImportDeclaration[] = file.statements
    .filter((c): c is ts.ImportDeclaration => ts.isImportDeclaration(c));
  const willImportCfg = importCfg && !isImported(file, 'DEFAULT_CONFIG', 'ngforage');

  for (const imp of imports) {
    const moduleSpecifier = imp.moduleSpecifier as ts.StringLiteral;
    if (!imp.importClause || moduleSpecifier.text !== 'ngforage') {
      continue;
    }

    const bindings = imp.importClause.namedBindings;
    if (!bindings || ts.isNamespaceImport(bindings) || !bindings.elements || !bindings.elements.length) {
      continue;
    }

    const maxIndex = bindings.elements.length - 1;
    for (let i = maxIndex; i > -1; i--) {
      const element = bindings.elements[i];

      if (element.name.getText() === 'NgForageModule') {
        if (bindings.elements.length > 1) {
          recorder.remove(element.getFullStart(), element.getFullWidth());
        } else {
          recorder.remove(imp.getFullStart(), imp.getFullWidth());
        }
        break;
      }
    }
  }

  if (willImportCfg) {
    recorder.insertLeft(0, `import {DEFAULT_CONFIG} from 'ngforage';\n`);
  }
}

function migrateOmit(tree: Tree, ctx: TypedSchematicContext<any, any>) {
  const regExclude = /node_modules/;
  const regInclude = /\.ts$/;

  ctx.logger.info('Building file tree');
  const matchedFiles: Readonly<FileEntry>[] = [];

  tree.visit((paff, entreh) => {
    if (regExclude.test(paff) || !regInclude.test(paff) || !entreh) {
      ctx.logger.debug(`${paff} didn't match`);

      return;
    }

    ctx.logger.debug(`${paff} matched`);
    matchedFiles.push(entreh);
  });

  let content: string;
  let src: ts.SourceFile;
  let recorder: UpdateRecorder;
  let hasChange: boolean;
  let stmt: ts.Statement;
  let i: number;
  for (const mf of matchedFiles) {
    content = (mf.content || tree.read(mf.path)).toString();
    src = ts.createSourceFile(mf.path, content, ts.ScriptTarget.Latest, true);

    if (!src.statements || !src.statements.length) {
      continue;
    }

    hasChange = false;
    recorder = tree.beginUpdate(mf.path);

    for (i = src.statements.length - 1; i > -1; i--) {
      stmt = src.statements[i];
      if (
        !ts.isImportDeclaration(stmt) ||
        !ts.isStringLiteral(stmt.moduleSpecifier) ||
        stmt.moduleSpecifier.text !== 'ngforage/lib/misc/omit.type'
      ) {
        continue;
      }

      ctx.logger.debug(`Found ${stmt.getText()} in ${mf.path}`);
      recorder.remove(stmt.getFullStart(), stmt.getFullWidth());
      hasChange = true;
    }

    if (hasChange) {
      tree.commitUpdate(recorder);
    }
  }
}

export function update(options: { project: string }): Rule {
  return (tree, ctx) => {
    const {ngModuleMetadata, modulePath, appModule} = loadAppModule(tree, options.project);
    const modulePathRecorder = tree.beginUpdate(modulePath);

    const importCfg = migrateForRoot(appModule, ngModuleMetadata, modulePathRecorder);
    migrateImports(appModule, importCfg, modulePathRecorder);
    migrateOmit(tree, ctx);

    tree.commitUpdate(modulePathRecorder);
  };
}
