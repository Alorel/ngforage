require('get-stdin')().then(js => {
  const uglify = require('uglify-es');
  const opts = require('../conf/uglify-options');

  function exit(code = 0) {
    setImmediate(() => {
      process.exit(code);
    });
  }

  try {
    const out = uglify.minify(js, opts);
    if (out.code) {
      process.stdout.write(out.code + "\n");
      exit(0);
    } else {
      process.stderr.write(require('util').inspect(out, {colors: true, depth: null}));
      exit(1);
    }
  } catch (e) {
    process.stderr.write(e.message);
    exit(1);
  }
});