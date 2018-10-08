const gulp = require('gulp');
const spawn = require('./util/spawn');

const args = [
  'node_modules/.bin/tslint',
  '-p',
  './tsconfig.json',
  '-s',
  'node_modules/custom-tslint-formatters/formatters',
  '-t',
  'grouped'
];

gulp.task('tslint', () => {
  return spawn(
    process.execPath,
    args
  )
});

gulp.task('tslint:fix', () => {
  return spawn(process.execPath, args.concat('--fix'));
})
