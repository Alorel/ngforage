const gulp = require('gulp');

gulp.task('copy:demo-to-pre-aot', () => {
  return gulp.src('./.tmp/src-inlined-templates/**/*')
    .pipe(gulp.dest('./.tmp/pre-aot'))
});
