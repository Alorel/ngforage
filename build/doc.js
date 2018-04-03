const gulp = require('gulp');

gulp.task('doc:clean', cb => {
  require('rimraf')('./demo/docs', cb);
});

gulp.task('doc:generate', ['doc:clean', 'changelog'], () => {
  const compodoc = require('@compodoc/gulp-compodoc');

  return gulp.src(['./index.ts', './NgForage/**/*.ts', '!**/*.spec.ts'], {cwd: './src'})
    .pipe(compodoc({
      tsconfig: './src/tsconfig.doc.json',
      // exportFormat: 'json',
      output: './demo/docs',
      name: `${require('../package').name} documentation`,
      hideGenerator: true,
      disablePrivate: true,
      disableInternal: true
    }));
});
