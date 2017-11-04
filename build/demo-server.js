const gulp = require('gulp');

gulp.task('server', cb => {
  const StaticServer = require('static-server');
  const {join} = require('path');


  server = new StaticServer({
    rootPath: join(process.cwd(), '.demo'),
    port: parseInt(process.env.PORT || '1111')
  });

  server.start(() => {
    console.log('\t\t\tDemo server listening on');
    console.log(`\t\t\thttp://127.0.0.1:${server.port}`);
    cb();
  });
});