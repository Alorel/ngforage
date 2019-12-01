import {Rule, Tree} from '@angular-devkit/schematics';
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

function addToPackageJson(host: Tree, pkg: string, version: string): Tree {
  if (host.exists(Strings.PKG_JSON)) {
    const json: any = JSON.parse(host.read(Strings.PKG_JSON)!.toString('utf8'));
    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);

      host.overwrite(Strings.PKG_JSON, JSON.stringify(json, null, 2) + EOL); //tslint:disable-line:no-magic-numbers max-line-length
    }
  } else {
    const contents = {
      dependencies: {
        [pkg]: version
      }
    };

    host.create(Strings.PKG_JSON, JSON.stringify(contents, null, 2) + EOL); //tslint:disable-line:no-magic-numbers max-line-length
  }

  return host;
}

/** Base ng add */
export function ngAdd(options: NgAddOptions): Rule {
  return (tree, context) => {
    const pkgJson = require('../../package.json');

    addToPackageJson(tree, 'localforage', pkgJson.peerDependencies.localforage);

    const installTaskId = context.addTask(new NodePackageInstallTask());
    context.addTask(new RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
  };
}
