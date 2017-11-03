process.chdir(__dirname);

global.Promise = require('bluebird');

const tmp = require('tmp');
tmp.setGracefulCleanup();

const glob = require('glob');
const gulp = require('gulp');
const {join} = require('path');

for (const file of glob.sync(join(__dirname, 'build', '**', '*.js'))) {
  require(file);
}

const watchTasks = Object.keys(gulp.tasks).filter(name => name.toLowerCase().endsWith(':watch'));
if (watchTasks.length) {
  gulp.task('watch', watchTasks);
}

//Sort tasks for display in IDE
const tasksNew = {};
for (const k of Object.keys(gulp.tasks).sort()) {
  tasksNew[k] = gulp.tasks[k];
}
gulp.tasks = tasksNew;
