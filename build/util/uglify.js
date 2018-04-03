const create = require('./create-gulp-transformer');

module.exports = create((file, encoding, done) => {
  const uglify = require('uglify-es');

  try {
    const uglified = uglify.minify(file.contents.toString());

    if (uglified.error) {
      done(e);
    } else {
      const code = uglified.code.toString();

      file = file.clone();
      file.contents = Buffer.from(code, 'utf8');

      done(null, file);
    }
  } catch (e) {
    done(e);
  }
});
