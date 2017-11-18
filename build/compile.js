const gulp            = require('gulp');
const spawn           = require('./util/x-spawn');
const {join}          = require('path');
const TsConfigFactory = require('./util/tsconfig-factory');

const binDir = join(process.cwd(), 'node_modules', '.bin');

const ngcPath     = join(binDir, 'ngc');
const webpackPath = join(binDir, 'webpack');

const MODE = require('./util/compile-mode');

const webpackEnv = (env, prod = false) => {
  const ret = {
    WEBPACK_COMPILE_MODE: env
  };
  
  if (prod) {
    ret.NODE_ENV             = 'production';
    ret.WEBPACK_FORCE_UGLIFY = '1';
  }
  
  return {env: ret};
};

gulp.task('compile:esm2015', ['clean:dist:esm2015'], () => {
  return spawn(ngcPath, ['-p', new TsConfigFactory(MODE.DIST_ESM2015).file]);
});

gulp.task('compile:esm5', ['clean:dist:esm5'], () => {
  return spawn(ngcPath, ['-p', new TsConfigFactory(MODE.DIST_ESM5).file]);
});

gulp.task('compile:es5', ['clean:dist:es5'], () => {
  return spawn(ngcPath, ['-p', new TsConfigFactory(MODE.DIST_ES5).file]);
});

gulp.task('compile:demo:aot:prepare', () => {
  return spawn(ngcPath, ['-p', new TsConfigFactory(MODE.DEMO_PRE_AOT).file]);
});

gulp.task('compile:demo:aot:finalise', () => {
  return spawn(
    webpackPath,
    ['--color', '--config', 'webpack.config.js'],
    webpackEnv(MODE.DEMO_AOT)
  );
});

gulp.task('compile:demo:aot:finalise:prod', () => {
  return spawn(
    webpackPath,
    ['--color', '--config', 'webpack.config.js'],
    webpackEnv(MODE.DEMO_AOT, true)
  );
});

gulp.task('compile:umd', ['clean:dist:umd'], () => {
  return spawn(
    webpackPath,
    ['--color', '--config', 'webpack.config.js'],
    webpackEnv(MODE.DIST_UMD)
  );
});

gulp.task('compile:demo', () => {
  return spawn(
    webpackPath,
    ['--color', '--config', 'webpack.config.js'],
    webpackEnv(MODE.DEMO_JIT)
  );
});

gulp.task('compile:demo:watch', () => {
  return spawn(
    webpackPath,
    ['--color', '--config', 'webpack.config.js', '--watch'],
    webpackEnv(MODE.DEMO_JIT)
  );
});
