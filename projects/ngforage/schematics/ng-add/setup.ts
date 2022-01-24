import {Rule, SchematicsException} from '@angular-devkit/schematics';
import {addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {InsertChange} from '@schematics/angular/utility/change';
import * as fs from 'fs';
import {dirname, join} from 'path';
import {loadAppModule} from '../_common/loadAppModule';
import {NgAddOptions} from './index';

const enum Strings {
  CFG_FILE = 'ngforage.config.ts'
}

export function ngAddSetupProject(options: NgAddOptions): Rule {
  return async (tree, context) => {
    const m = loadAppModule(tree, options.project);
    const [modulePath, appModule] = await Promise.all([m.modulePath$, m.appModule$]);

    const moduleFileContent = tree.read(modulePath);
    if (!moduleFileContent) {
      throw new SchematicsException(`Could not read app module ${modulePath}`);
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
