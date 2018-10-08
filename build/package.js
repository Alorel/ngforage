const gulp = require('gulp');
const spawn = require('./util/spawn');

gulp.task('package:package', () => {
  return spawn(
    process.execPath,
    [
      'node_modules/.bin/ng-packagr',
      '-p',
      './package.json'
    ]
  )
});

gulp.task('package:clean-metadata', () => {
  const forEach = require('lodash/forEach');
  const isObject = require('lodash/isObject');
  const fs = require('fs');
  const inFile = './dist/ngforage.metadata.json';
  const fContents = JSON.parse(fs.readFileSync(inFile, 'utf8'));

  const doClean = root => {
    forEach(root, (value, key) => {
      if (value === '../config/NgForageConfig.service') {
        delete root[key];
      } else if (Array.isArray(value)) {
        for (const v of value) {
          doClean(v);
        }
      } else if (isObject(value)) {
        doClean(value);
      }
    });
  };

  doClean(fContents);

  fs.writeFileSync(inFile, JSON.stringify(fContents));
});

gulp.task('package:clean-dist-tgz', cb => {
  require('fs').unlink('./dist.tgz', () => cb());
});

gulp.task('package', cb => {
  const seq = require('./util/seq');

  seq(
    'package:package',
    ['package:clean-metadata', 'package:clean-dist-tgz'],
    cb
  )
});
