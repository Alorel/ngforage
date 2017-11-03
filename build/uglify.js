const gulp = require('gulp');
const Uglify = require('./util/uglify');

gulp.task('uglify:demo', () => {
  return gulp.src('./.demo/**/*.js')
    .pipe(new Uglify())
    .pipe(gulp.dest('./.demo'));
});