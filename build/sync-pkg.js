const {resolve} = require('path');
const glob = require('glob').sync;
const fs = require('fs');
const _ = require('lodash');

const root = resolve(__dirname, '..');
const rootPkg = require('../package');

const keyPriority = ['peerDependencies', 'dependencies', 'devDependencies'];
const syncedKeys = [
  'name',
  'description',
  'version',
  'keywords',
  'author',
  'repository',
  'homepage',
  'bugs',
  'license',
  'publishConfig',
  'contributors'
];

glob('./projects/**/package.json', {cwd: root, absolute: true})
  .forEach(path => {
    const initialPkg = require(path);
    const pkg = _.cloneDeep(initialPkg);
    for (const pkgKey of keyPriority) {
      const section = pkg[pkgKey];

      if (section) {
        _.forEach(section, (_value, key) => {
          for (const rootKey of keyPriority) {
            const version = _.get(rootPkg, [rootKey, key]);
            if (version) {
              section[key] = version;
              break;
            }
          }
        })
      }
    }

    for (const key of syncedKeys) {
      if (_.has(rootPkg, key)) {
        _.set(pkg, key, _.get(rootPkg, key));
      }
    }

    if (!_.isEqual(pkg, initialPkg)) {
      fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
    }
  });
