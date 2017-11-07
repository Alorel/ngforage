const gulp = require('gulp');
const seq = require('gulp-sequence');

gulp.task('build', cb => {
  seq(
    'inline:compile',
    [
      'compile:esm5',
      'compile:es5',
      'compile:esm2015',
      'compile:umd'
    ],
    cb
  );
});

const aotTask = isProd => {
  const lastStep = [
    'clean:tmp:aot',
    'clean:tmp:pre-aot',
    'clean:demo:map'
  ];
  
  if (isProd) {
    lastStep.push('uglify:demo');
  }
  
  return cb => {
    seq(
      [
        'clean:tmp:pre-aot',
        'clean:tmp:aot',
        'clean:demo'
      ],
      'inline-templates',
      'copy:demo-to-pre-aot',
      'compile:demo:aot:prepare',
      `compile:demo:aot:finalise`,
      lastStep,
      cb
    )
  };
};

gulp.task('build:demo:aot', aotTask(false));
gulp.task('build:demo:aot:prod', aotTask(true));

gulp.task('build:demo:jit', cb => {
  seq(
    'clean:demo',
    'compile:demo',
    cb
  )
});