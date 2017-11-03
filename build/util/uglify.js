const {Transform} = require('stream');
const uglify = require('uglify-es');
const {merge} = require('lodash');

class GulpUglifyES extends Transform {

  constructor(options = {}) {
    super({objectMode: true});
    this.options = merge(require('../conf/uglify-options'), options);
  }

  _transform(file, encoding, callback) {
    try {
      file = file.clone();
      const contents = file.contents.toString();
      const out = uglify.minify(contents, this.options);
      file.contents = Buffer.from(out.code, encoding);
      setImmediate(callback, null, file);
    } catch (e) {
      setImmediate(callback, e);
    }
  }
}

module.exports = GulpUglifyES;