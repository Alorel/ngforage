import {SchematicsException, Tree} from '@angular-devkit/schematics';
import {getProjectFromWorkspace, getProjectMainFile} from '@angular/cdk/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import {getAppModulePath} from '@schematics/angular/utility/ng-ast-utils';
import {ProjectType, WorkspaceProject, WorkspaceSchema} from '@schematics/angular/utility/workspace-models';
import * as ts from 'typescript';
import {findNgModuleMetadata} from './findNgModuleMetadata';

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

  public get appModule() {
    const moduleFileContent = this._tree.read(this.modulePath);
    if (!moduleFileContent) {
      throw new SchematicsException(`Could not read app module ${this.modulePath}`);
    }
    const value = ts.createSourceFile(
      this.modulePath,
      moduleFileContent.toString('utf8'),
      ts.ScriptTarget.Latest,
      true
    );
    Object.defineProperty(this, 'appModule', {value});

    return value;
  }

  public get modulePath() {
    const value = getAppModulePath(this._tree, getProjectMainFile(this.project));
    Object.defineProperty(this, 'modulePath', {value});

    return value;
  }

  public get ngModuleMetadata() {
    const value = findNgModuleMetadata(this.appModule);
    if (!value) {
      throw new SchematicsException(`Could not find NgModule declaration inside ${this.modulePath}`);
    }
    Object.defineProperty(this, 'ngModuleMetadata', {value});

    return value;
  }

  public get project() {
    const value = getProjectFromWorkspace(this.workspace, this._projectName) as WorkspaceProject<T>;
    Object.defineProperty(this, 'project', {value});

    return value;
  }

  public get workspace() {
    const value = getWorkspace(this._tree);
    Object.defineProperty(this, 'workspace', {value});

    return value;
  }
}

export function loadAppModule<T extends ProjectType = ProjectType.Application>(
  tree: Tree,
  projectName: string
): LoadedAppModule<T> {
  return new LoadedAppModuleImpl(tree, projectName);
}
