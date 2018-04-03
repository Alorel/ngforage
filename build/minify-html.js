const gulp = require('gulp');

gulp.task('minify:demo-html', cb => {
  const fs = require('fs');

  fs.readFile('demo/index.html', 'utf8', (err, contents) => {
    if (err) {
      return cb(err);
    }
    const htmlmin = require('html-minifier');

    try {
      const minified = htmlmin.minify(contents, {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: true,
        minifyCSS: true,
        useShortDoctype: true
      });

      fs.writeFile('demo/index.html', minified, e => {
        if (e) {
          cb(e);
        } else {
          cb();
        }
      })
    } catch (e) {
      cb(e);
    }
  })
});
