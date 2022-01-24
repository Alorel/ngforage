import {Rule, TaskId, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask, RunSchematicTask} from '@angular-devkit/schematics/tasks';
import {EOL} from 'os';

const enum Strings {
  PKG_JSON = 'package.json'
}

export interface NgAddOptions {
  project: string;
}

function sortObjectByKeys(obj: { [k: string]: any }) {
  const keys = Object.keys(obj);
  keys.sort();

  return keys.reduce((result: any, key: string) => (result[key] = obj[key]) && result, {});
}

function readPkgJson(host: Tree): { [k: string]: any } {
  return JSON.parse(host.read(Strings.PKG_JSON)!.toString('utf8'));
}

function hasDependency(host: Tree, pkg: string, version: string | null = null, json?: { [k: string]: any }): boolean {
  if (!host.exists(Strings.PKG_JSON)) {
    return false;
  }

  if (!json) {
    json = readPkgJson(host);
  }

  if (!json['dependencies']) {
    return false;
  }

  const dep = json['dependencies'][pkg];

  return !!dep && (version === null || dep === version);
}

function addToPackageJson(host: Tree, pkg: string, version: string): boolean {
  if (host.exists(Strings.PKG_JSON)) {
    const json = readPkgJson(host);
    if (hasDependency(host, pkg, version, json)) {
      return false;
    }
    if (!json['dependencies']) {
      json['dependencies'] = {};
    }

    if (!json['dependencies'][pkg]) {
      json['dependencies'][pkg] = version;
      json['dependencies'] = sortObjectByKeys(json['dependencies']);

      host.overwrite(Strings.PKG_JSON, JSON.stringify(json, null, 2) + EOL);

      return true;
    } else {
      return false;
    }
  } else {
    const contents = {
      dependencies: {
        [pkg]: version
      }
    };

    host.create(Strings.PKG_JSON, JSON.stringify(contents, null, 2) + EOL);

    return true;
  }
}

/** Base ng add */
export function ngAdd(options: NgAddOptions): Rule {
  return (tree, context) => {
    const pkgJson = require('../../package.json');

    const taskDeps: TaskId[] = [];
    const addedLocalforage = addToPackageJson(tree, 'localforage', pkgJson.peerDependencies.localforage);
    const hasNgforage = hasDependency(tree, 'ngforage');
    if (addedLocalforage || !hasNgforage) {
      taskDeps.push(context.addTask(new NodePackageInstallTask()));
    }

    context.addTask(new RunSchematicTask('ng-add-setup-project', options), taskDeps);
  };
}
