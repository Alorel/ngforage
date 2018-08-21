global.Promise = require('bluebird');
const {join, resolve} = require('path');
const glob = Promise.promisify(require('glob'));
const fs = require('fs-extra');

const cwd = resolve(__dirname, '..');

Promise
  .reduce(
    ['{README,CHANGELOG}.md', 'LICENSE'],
    (acc, g) => {
      return glob(g, {cwd})
        .then(r => {
          acc.push(...r);

          return acc;
        })
    },
    []
  )
  .map(src => fs.copy(join(cwd, src), join(cwd, 'dist', 'ngforage', src)))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
