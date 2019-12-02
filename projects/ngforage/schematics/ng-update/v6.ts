import {Rule, UpdateRecorder} from '@angular-devkit/schematics';
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

export function update(options: { project: string }): Rule {
  return (tree, _ctx) => {
    const {ngModuleMetadata, modulePath, appModule} = loadAppModule(tree, options.project);
    const recorder = tree.beginUpdate(modulePath);

    const importCfg = migrateForRoot(appModule, ngModuleMetadata, recorder);
    migrateImports(appModule, importCfg, recorder);

    tree.commitUpdate(recorder);
  };
}
