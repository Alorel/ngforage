const {join, dirname} = require('path');
const {promisify} = require('util');
const glob = promisify(require('glob'));

const DIR_SCHEMATICS = join(__dirname, 'schematics');

const OUT_ROOT = join(__dirname, '..', '..', 'dist', 'ngforage', 'schematics');
const fs = require('fs');
const mkdirOpts = {recursive: true};
const copyFile = promisify(fs.copyFile);

function copy(file) {
  const srcAbsolute = join(DIR_SCHEMATICS, file);
  const distAbsolute = join(OUT_ROOT, file);
  const outDir = dirname(distAbsolute);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, mkdirOpts);
  }

  return copyFile(srcAbsolute, distAbsolute);
}

Promise.all([glob('**/*.json', {cwd: DIR_SCHEMATICS}), glob('**/files/**/*', {cwd: DIR_SCHEMATICS})])
  .then(([jsons, files]) => {
    const combined = [...jsons, ...files];

    return Promise.all(combined.map(copy));
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
