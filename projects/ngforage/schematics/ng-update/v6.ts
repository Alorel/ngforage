import {FileEntry, Rule, Tree, TypedSchematicContext, UpdateRecorder} from '@angular-devkit/schematics';
import {isImported} from '@schematics/angular/utility/ast-utils';
import {LazyGetter} from 'lazy-get-decorator';
import * as ts from 'typescript';
import {insertMetaEntry} from '../_common/insertMetaEntry';
import {loadAppModule} from '../_common/loadAppModule';

const lazyGetter = LazyGetter();

//tslint:disable:max-classes-per-file

class ForRootMigrater {

  private rmLength: number;

  public constructor(
    private readonly appModule: ts.SourceFile,
    private readonly ngModuleMetadata: ts.ObjectLiteralExpression,
    private readonly recorder: UpdateRecorder
  ) {
  }

  public process(): boolean {
    let returnValue = false;

    for (const property of this.ngModuleMetadata.properties) {
      if (
        !ts.isPropertyAssignment(property) ||
        property.name.getText() !== 'imports' ||
        !ts.isArrayLiteralExpression(property.initializer)
      ) {
        continue;
      }

      if (this.property(property as any)) {
        returnValue = true;
      }
    }

    return returnValue;
  }

  /** Returns true if a DEFAULT_OPTIONS import should be generated */
  private arg(arg: ts.Expression): boolean {
    if (ts.isIdentifier(arg) || ts.isObjectLiteralExpression(arg) || ts.isAsExpression(arg)) {
      const useValue = arg.getText();

      if (useValue) {
        const provide = `{\n      provide: DEFAULT_CONFIG,\n      useValue: ${useValue}\n    }`;
        insertMetaEntry('providers', this.appModule, this.recorder, provide);

        return true;
      }
    }

    return false;
  }

  /** Returns true if a DEFAULT_OPTIONS import should be generated */
  private callExpr(el: ts.CallExpression): boolean {
    const access = el.expression;
    let returnValue = false;

    if (
      ts.isPropertyAccessExpression(access) &&
      access.expression.getText() === 'NgForageModule' &&
      access.name.getText() === 'forRoot'
    ) {
      const arg = el.arguments[0];
      if (arg && this.arg(arg)) {
        returnValue = true;
      }

      this.recorder.remove(el.pos, this.rmLength);
    }

    return returnValue;
  }

  private identifier(el: ts.Identifier): void {
    if (el.getText() === 'NgForageModule') {
      this.recorder.remove(el.pos, this.rmLength);
    }
  }

  /** Returns true if a DEFAULT_OPTIONS import should be generated */
  private property(property: ts.PropertyAssignment & { initializer: ts.ArrayLiteralExpression }): boolean {
    const elements = (property.initializer).elements;
    const maxIndex = elements.length - 1;
    let returnValue = false;

    for (let i = maxIndex; i > -1; i--) {
      const el = elements[i];
      this.rmLength = (i === maxIndex ? 0 : 1) + el.getFullWidth();

      if (ts.isIdentifier(el)) {
        this.identifier(el);
      } else if (ts.isCallExpression(el) && this.callExpr(el)) {
        returnValue = true;
      }
    }

    return returnValue;
  }
}

class ImportMigrater {

  public constructor(
    private readonly file: ts.SourceFile,
    private readonly importCfg: boolean,
    private readonly recorder: UpdateRecorder
  ) {
  }

  @lazyGetter
  private get imports(): ts.ImportDeclaration[] {
    return this.file.statements
      .filter((c): c is ts.ImportDeclaration => ts.isImportDeclaration(c));
  }

  @lazyGetter
  private get willImportCfg(): boolean {
    return this.importCfg && !isImported(this.file, 'DEFAULT_CONFIG', 'ngforage');
  }

  public process(): void {
    for (const imp of this.imports) {
      this.import(imp);
    }

    if (this.willImportCfg) {
      this.recorder.insertLeft(0, `import {DEFAULT_CONFIG} from 'ngforage';\n`);
    }
  }

  private element(element: ts.ImportSpecifier, numBindings: number, imp: ts.ImportDeclaration): boolean {
    if (element.name.getText() === 'NgForageModule') {
      if (numBindings > 1) {
        this.recorder.remove(element.getFullStart(), element.getFullWidth());
      } else {
        this.recorder.remove(imp.getFullStart(), imp.getFullWidth());
      }

      return true;
    }

    return false;
  }

  private import(imp: ts.ImportDeclaration): void {
    const moduleSpecifier = imp.moduleSpecifier as ts.StringLiteral;
    if (!imp.importClause || moduleSpecifier.text !== 'ngforage') {
      return;
    }

    const bindings = imp.importClause.namedBindings as ts.NamedImports;
    if (!bindings || !bindings.elements || !bindings.elements.length || ts.isNamespaceImport(bindings)) {
      return;
    }

    const maxIndex = bindings.elements.length - 1;
    for (let i = maxIndex; i > -1; i--) {
      if (this.element(bindings.elements[i], bindings.elements.length, imp)) {
        break;
      }
    }
  }
}

class OmitMigrater {
  public constructor(
    private readonly tree: Tree,
    private readonly ctx: TypedSchematicContext<any, any>
  ) {
  }

  @lazyGetter
  private get matchedFiles(): Readonly<FileEntry>[] {
    const matchedFiles: Readonly<FileEntry>[] = [];
    const regExclude = /node_modules/;
    const regInclude = /\.ts$/;

    this.info('Building file tree');

    this.tree.visit((path, entry) => {
      if (regExclude.test(path) || !regInclude.test(path) || !entry) {
        this.debug(`${path} didn't match`);

        return;
      }

      this.debug(`${path} matched`);
      matchedFiles.push(entry);
    });

    this.info('File tree built');

    return matchedFiles;
  }

  public process(): void {
    for (const mf of this.matchedFiles) {
      this.file(mf);
    }
  }

  private debug(msg: string) {
    this.ctx.logger.debug(msg);
  }

  private file(mf: Readonly<FileEntry>): void {
    const content: string = (mf.content || this.tree.read(mf.path)).toString();
    const src: ts.SourceFile = ts.createSourceFile(mf.path, content, ts.ScriptTarget.Latest, true);

    if (!src.statements || !src.statements.length) {
      return;
    }

    let hasChange = false;
    const recorder = this.tree.beginUpdate(mf.path);

    for (let i = src.statements.length - 1; i > -1; i--) {
      if (this.statement(src.statements[i], recorder, mf)) {
        hasChange = true;
      }
    }

    if (hasChange) {
      this.tree.commitUpdate(recorder);
    }
  }

  private info(msg: string) {
    this.ctx.logger.info(msg);
  }

  private statement(stmt: ts.Statement, recorder: UpdateRecorder, mf: Readonly<FileEntry>): boolean {
    if (
      !ts.isImportDeclaration(stmt) ||
      !ts.isStringLiteral(stmt.moduleSpecifier) ||
      stmt.moduleSpecifier.text !== 'ngforage/lib/misc/omit.type'
    ) {
      return false;
    }

    this.debug(`Found ${stmt.getText()} in ${mf.path}`);
    recorder.remove(stmt.getFullStart(), stmt.getFullWidth());

    return true;
  }
}

export function update(options: { project: string }): Rule {
  return (tree, ctx) => {
    const {ngModuleMetadata, modulePath, appModule} = loadAppModule(tree, options.project);
    const modulePathRecorder = tree.beginUpdate(modulePath);

    const importCfg = new ForRootMigrater(appModule, ngModuleMetadata, modulePathRecorder).process();
    new ImportMigrater(appModule, importCfg, modulePathRecorder).process();
    tree.commitUpdate(modulePathRecorder);

    new OmitMigrater(tree, ctx).process();
  };
}
