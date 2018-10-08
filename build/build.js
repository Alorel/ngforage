const gulp = require('gulp');
const spawn = require('./util/spawn');
const seq = require('./util/seq');

gulp.task('build:demo:generate', () => {
  return spawn(
    process.execPath,
    [
      'node_modules/.bin/ng',
      'build',
      '--delete-output-path'
    ]
  )
});

gulp.task('build:demo', cb => {
  seq('build:demo:generate', 'doc:generate', cb);
})

gulp.task('build:demo:prod:generate', () => {
  return spawn(
    process.execPath,
    [
      'node_modules/.bin/ng',
      'build',
      '--delete-output-path',
      '--environment',
      'prod',
      '--aot',
      '--build-optimizer',
      '--output-hashing',
      'all'
    ]
  )
});

gulp.task('build:demo:prod', cb => {
  seq(
    'build:demo:prod:generate',
    [
      'clean:demo-map',
      'minify:demo-html',
      'uglify:demo'
    ],
    'doc:generate',
    cb
  )
});
