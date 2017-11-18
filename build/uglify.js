const gulp   = require('gulp');
const Uglify = require('./util/uglify');

gulp.task('uglify:demo', () => {
  const src = [
    './.demo/sw.js',
    './.demo/workbox-sw*.js'
  ];
  return gulp.src(src)
             .pipe(new Uglify({ecma: 6}))
             .pipe(gulp.dest('./.demo'));
});
