const gulp = require('gulp');
const _ = require('lodash');
const rimraf = require('rimraf');
const RmEmptyFiles = require('./util/rm-empty-files');
const fs = Promise.promisifyAll(require('fs'));
const {join} = require('path');

const rimrafJobs = {
  'demo': '.demo',
  'dist:esm5': 'dist/esm5',
  'dist:es5': 'dist/es5',
  'dist:esm2015': 'dist/esm2015',
  'dist:umd': 'dist/umd',
  'tmp:src-inlined-templates': '.tmp/src-inlined-templates',
  'tmp:pre-aot': '.tmp/pre-aot',
  'tmp:aot': '.tmp/aot',
  'demo:map': '.demo/*.map',
  'awcache': '.awcache'
};

_.forEach(rimrafJobs, (dir, job) => {
  gulp.task(`clean:${job}`, cb => {
    rimraf(dir, cb);
  })
});

gulp.task('clean:empty-declarations', () => {
  return gulp.src('./dist/**/*.d.ts')
    .pipe(new RmEmptyFiles());
});

gulp.task('clean:tmp-config', () => {
  return fs.readdirAsync(process.cwd(), 'utf8')
    .filter(f => f.endsWith('.tmp.js') || f.endsWith('.tmp.json'))
    .map(f => join(process.cwd(), f))
    .map(f => fs.unlinkAsync(f));
});

const cleanJobKeys = Object.keys(rimrafJobs);
const cleanJobNameMapper = k => `clean:${k}`;

gulp.task('clean:dist', cleanJobKeys.filter(k => k.startsWith('dist:')).map(cleanJobNameMapper));
gulp.task('clean', cleanJobKeys.map(cleanJobNameMapper).concat('clean:tmp-config'));