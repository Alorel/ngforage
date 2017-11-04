const {Writable} = require('stream');
const fs = require('fs');

module.exports = class RmEmptyFiles extends Writable {

  constructor() {
    super({objectMode: true});
  }

  _write(file, encoding, cb) {
    let contents = file.contents;

    if (contents && contents.toString().trim()) {
      return cb();
    }

    fs.unlink(file.path, cb);
  }
};