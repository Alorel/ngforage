const gulp = require('gulp');

gulp.task('copy:typings', ['clean:empty-declarations'], () => {
  return gulp.src('./dist/esm2015/**/*.d.ts')
    .pipe(gulp.dest('./dist/typings'));
});

gulp.task('copy:demo-to-pre-aot', () => {
  return gulp.src('./.tmp/src-inlined-templates/**/*')
    .pipe(gulp.dest('./.tmp/pre-aot'))
});
