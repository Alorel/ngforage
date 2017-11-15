process.chdir(__dirname);

global.Promise = require('bluebird');

const tmp = require('tmp');
tmp.setGracefulCleanup();

const glob = require('glob');
const gulp = require('gulp');
const {join} = require('path');

glob.sync(join(__dirname, 'build', '**', '*.js'))
  .filter(f => !f.endsWith('uglify-worker.js'))
  .forEach(p => require(p));

const watchTasks = Object.keys(gulp.tasks).filter(name => name.toLowerCase().endsWith(':watch'));
if (watchTasks.length) {
  gulp.task('watch', watchTasks);
}

//Sort tasks for display in IDE
gulp.tasks = Object.keys(gulp.tasks).sort()
  .reduce((acc, k) => {
    acc[k] = gulp.tasks[k];
    return acc;
  }, {});
