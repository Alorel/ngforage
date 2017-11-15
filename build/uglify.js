const gulp = require('gulp');
const Uglify = require('./util/uglify');
const filter = require('gulp-filter');

gulp.task('uglify:demo', () => {
  return gulp.src('./.demo/**/*.js')
    .pipe(filter(f => !f.path.includes('documentation')))
    .pipe(new Uglify())
    .pipe(gulp.dest('./.demo'));
});
