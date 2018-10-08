const gulp = require('gulp');
const clean = require('gulp-clean');

gulp.task('clean:demo-map', () => {
  return gulp.src('demo/**/*.js.map', {read: false})
    .pipe(clean());
});
