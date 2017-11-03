const {Transform} = require('stream');
const fs = require('fs');

module.exports = class GulpRemove extends Transform {

  constructor() {
    super({objectMode: true});
  }

  _write(file, encoding, cb) {
    file = file.clone();

    fs.unlink(file.path, e => {
      if (e) {
        cb(e);
      } else {
        cb(null, file.clone());
      }
    });
  }
};