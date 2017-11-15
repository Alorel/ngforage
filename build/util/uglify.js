const {Transform} = require('stream');
const spawn = require('cross-spawn');
const worker = require('path').join(__dirname, 'uglify-worker.js');
const Promise = require('bluebird');
const uglifyES = require('uglify-es');
const {merge} = require('lodash');

class GulpUglifyES extends Transform {

  constructor(options = {}) {
    super({objectMode: true});
    this.options = merge(require('../conf/uglify-options'), options);
  }

  _transform(file, encoding, callback) {
    try {
      file = file.clone();
      const out = uglifyES.minify(file.contents.toString(), this.options);

      if (typeof out.code !== 'undefined') {
        if (typeof out.code === 'string') {
          out.code = Buffer.from(out.code, 'utf8');
        }

        file.contents = out.code;
        setImmediate(callback, null, file);
      } else {
        console.error(require('util').inspect(out, {colors: true, depth: null}));
        setImmediate(callback, new Error('No code'));
      }
    } catch (e) {
      setImmediate(callback, e);
    }
  }
}

module.exports = GulpUglifyES;