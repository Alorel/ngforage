const {Transform} = require('stream');

module.exports = transformer => {
  class Transformer extends Transform {
    constructor(opts = {}) {
      super(Object.assign({objectMode: true}, opts));
      this.opts = opts;
    }
  }

  Transformer.prototype._transform = transformer;

  return Transformer;
};
