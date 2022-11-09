import {ProjectDefinition} from '@angular-devkit/core/src/workspace';
import {SchematicsException, Tree} from '@angular-devkit/schematics';
import {getAppModulePath, getProjectFromWorkspace, getProjectMainFile} from '@angular/cdk/schematics';
import {AngularWorkspace, getWorkspace} from '@angular/cli/src/utilities/config';
import {LazyGetter} from 'lazy-get-decorator';
import * as ts from 'typescript';
import {findNgModuleMetadata} from './findNgModuleMetadata';

const lazyGetter = LazyGetter();

export interface LoadedAppModule {
  readonly appModule$: Promise<ts.SourceFile>;

  readonly modulePath$: Promise<string>;

  readonly ngModuleMetadata$: Promise<ts.ObjectLiteralExpression>;

  readonly project$: Promise<ProjectDefinition>;

  readonly workspace$: Promise<AngularWorkspace>;
}

class LoadedAppModuleImpl implements LoadedAppModule {
  public constructor(private readonly _tree: Tree, private readonly _projectName: string) {
  }

  @lazyGetter
  public get appModule$(): Promise<ts.SourceFile> {
    return this.modulePath$
      .then(p => {
        const moduleFileContent = this._tree.read(p);
        if (!moduleFileContent) {
          throw new SchematicsException(`Could not read app module ${p}`);
        }

        return ts.createSourceFile(
          p,
          moduleFileContent.toString('utf8'),
          ts.ScriptTarget.Latest,
          true
        );
      });
  }

  @lazyGetter
  public get modulePath$(): Promise<string> {
    return this.project$
      .then(p => getAppModulePath(this._tree, getProjectMainFile(p)));
  }

  @lazyGetter
  public get ngModuleMetadata$(): Promise<ts.ObjectLiteralExpression> {
    return this.appModule$
      .then(appM => {
        const value = findNgModuleMetadata(appM);

        if (!value) {
          return this.modulePath$
            .then(p => {
              throw new SchematicsException(`Could not find NgModule declaration inside ${p}`);
            });
        }

        return value;
      });
  }

  @lazyGetter
  public get project$(): Promise<ProjectDefinition> {
    return this.workspace$
      .then(ws => getProjectFromWorkspace(ws!, this._projectName));
  }

  @lazyGetter
  public get workspace$(): Promise<AngularWorkspace> {
    return getWorkspace('local') as Promise<AngularWorkspace>;
  }
}

export function loadAppModule(
  tree: Tree,
  projectName: string
): LoadedAppModule {
  return new LoadedAppModuleImpl(tree, projectName);
}
