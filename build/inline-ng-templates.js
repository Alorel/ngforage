const gulp = require('gulp');
const inliner = require('gulp-inline-ng2-template');
const pug = require('pug');
const sass = require('node-sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const {dirname} = require('path');
const seq = require('gulp-sequence');

const conf = {
  src: './src/**/*.ts',
  dest: './.tmp/src-inlined-templates',
  autoprefixer: {
    browsers: 'last 1000 versions',
    grid: true
  },
  inliner: {
    useRelativePaths: true,
    templateExtension: '.pug',
    indent: 0,
    removeLineBreaks: true,
    templateProcessor(path, ext, contents, cb) {
      try {
        const rendered = pug.render(contents, {
          filename: path,
          doctype: 'html'
        });

        setImmediate(cb, null, rendered.trim());
      } catch (e) {
        setImmediate(cb, e);
      }
    },
    styleProcessor(path, ext, contents, cb) {
      sass.render({
        data: contents,
        outputStyle: 'compressed',
        includePaths: [dirname(path)],
        linefeed: 'lf'
      }, (err, sassOutput) => {
        if (err) {
          return cb(err);
        }

        postcss(autoprefixer(conf.autoprefixer)).process(sassOutput.css)
          .then(r => cb(null, r.css))
          .catch(cb);
      });
    }
  }
};

gulp.task('inline-templates', ['clean:tmp:src-inlined-templates'], () => {
  return gulp.src(conf.src)
    .pipe(inliner(conf.inliner))
    .pipe(gulp.dest(conf.dest));
});

gulp.task('inline:compile', cb => {
  seq(
    'inline-templates',
    ['compile:esm5', 'compile:esm2015'],
    cb
  );
});