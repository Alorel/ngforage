const gulp = require('gulp');
const spawn = require('./util/spawn');

gulp.task('package', () => {
  return spawn(
    process.execPath,
    [
      'node_modules/.bin/ng-packagr',
      '-p',
      './package.json'
    ]
  )
});
