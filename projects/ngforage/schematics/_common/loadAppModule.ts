import {SchematicsException, Tree} from '@angular-devkit/schematics';
import {getProjectFromWorkspace, getProjectMainFile} from '@angular/cdk/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import {getAppModulePath} from '@schematics/angular/utility/ng-ast-utils';
import {ProjectType, WorkspaceProject, WorkspaceSchema} from '@schematics/angular/utility/workspace-models';
import {LazyGetter} from 'lazy-get-decorator';
import * as ts from 'typescript';
import {findNgModuleMetadata} from './findNgModuleMetadata';

const lazyGetter = LazyGetter();

export interface LoadedAppModule<T extends ProjectType = ProjectType.Application> {
  readonly appModule: ts.SourceFile;

  readonly modulePath: string;

  readonly ngModuleMetadata: ts.ObjectLiteralExpression;

  readonly project: WorkspaceProject<T>;

  readonly workspace: WorkspaceSchema;
}

class LoadedAppModuleImpl<T extends ProjectType> implements LoadedAppModule<T> {
  public constructor(private readonly _tree: Tree, private readonly _projectName: string) {
  }

  @lazyGetter
  public get appModule(): ts.SourceFile {
    const moduleFileContent = this._tree.read(this.modulePath);
    if (!moduleFileContent) {
      throw new SchematicsException(`Could not read app module ${this.modulePath}`);
    }

    return ts.createSourceFile(
      this.modulePath,
      moduleFileContent.toString('utf8'),
      ts.ScriptTarget.Latest,
      true
    );
  }

  @lazyGetter
  public get modulePath(): string {
    return getAppModulePath(this._tree, getProjectMainFile(this.project));
  }

  @lazyGetter
  public get ngModuleMetadata(): ts.ObjectLiteralExpression {
    const value = findNgModuleMetadata(this.appModule);
    if (!value) {
      throw new SchematicsException(`Could not find NgModule declaration inside ${this.modulePath}`);
    }

    return value;
  }

  @lazyGetter
  public get project(): WorkspaceProject<T> {
    return getProjectFromWorkspace(this.workspace, this._projectName) as WorkspaceProject<T>;
  }

  @lazyGetter
  public get workspace(): WorkspaceSchema {
    return getWorkspace(this._tree);
  }
}

export function loadAppModule<T extends ProjectType = ProjectType.Application>(
  tree: Tree,
  projectName: string
): LoadedAppModule<T> {
  return new LoadedAppModuleImpl(tree, projectName);
}
