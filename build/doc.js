const gulp = require('gulp');
const xSpawn = require('./util/x-spawn');
const rimraf = require('rimraf');
const htmlmin = require('gulp-htmlmin');
const seq = require('gulp-sequence');
const filter = require('gulp-filter');
const uglify = require('./util/uglify');
const sass = require('node-sass');
const tar = require('gulp-tar');
const gzip = require('gulp-gzip');
const fs = require('fs');
const {resolve, dirname} = require('path');

const versionPath = (() => {
  const pkgVersion = require('../package.json').version;
  const semver = require('semver');

  return `${semver.major(pkgVersion)}.${semver.minor(pkgVersion)}`
})();

const docPath = `./documentation/${versionPath}`;

gulp.task('doc:clean', cb => rimraf(docPath, cb));

gulp.task('doc:generate', () => {
  const opts = [
    '-p',
    'tsconfig.doc.json',
    '--disableInternal',
    '--disablePrivate',
    '--hideGenerator',
    '--disableLifeCycleCallbacks',
    '--theme',
    'laravel',
    '--name',
    'NgForage',
    '--output',
    docPath,
    'src/NgForage'
  ];

  return xSpawn('./node_modules/.bin/compodoc', opts);
});

gulp.task('doc:min:html', () => {
  return gulp.src(`${docPath}/**/*.html`)
    .pipe(filter(p => !/index\.html/.test(p.path)))
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      decodeEntities: true
    }))
    .pipe(gulp.dest(docPath));
});

gulp.task('doc:min:svg', () => {
  return gulp.src(`${docPath}/**/*.svg`)
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      decodeEntities: true
    }))
    .pipe(gulp.dest(docPath));
});

gulp.task('doc:css:replace-import', () => {
});

gulp.task('doc:min:css', () => {
  return gulp.src(`${docPath}/**/*.css`)
    .pipe((() => {
      const {Transform} = require('stream');

      class Sass extends Transform {
        constructor() {
          super({objectMode: true});
        }

        _transform(file, enc, done) {
          sass.render({
            file: file.path,
            data: file.contents.toString(),
            outputStyle: 'compressed',
            importer(url, prev, done) {
              const href = resolve(dirname(file.path), url);
              fs.readFile(href, 'utf8', (e, data) => {
                if (e) done(e);
                else done({
                  file: href, // only one of them is required, see section Special Behaviours.
                  contents: data
                });
              });
            }
          }, (e, res) => {
            if (e) done(e);
            else {
              file = file.clone();
              if (typeof res.css === 'string') {
                res.css = Buffer.from(res.css, 'utf8');
              }

              file.contents = res.css;
              done(null, file);
            }
          })
        }
      }

      return new Sass();
    })())
    .pipe(gulp.dest(docPath));
});

gulp.task('doc:min:js', () => {
  return gulp.src(`${docPath}/**/*.js`)
    .pipe(new uglify())
    .pipe(gulp.dest(docPath));
});

gulp.task('doc:archive', () => {
  return gulp.src(`${docPath}/**/*`)
    .pipe(tar(`documentation.tar`))
    .pipe(gzip({
      extension: 'gz',
      threshold: true,
      gzipOptions: {
        level: 9
      }
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('doc', cb => {
  seq(
    'doc:clean',
    'doc:generate',
    [
      'doc:min:html',
      'doc:min:svg',
      'doc:min:css',
      'doc:min:js'
    ],
    'doc:archive',
    cb
  );
});
