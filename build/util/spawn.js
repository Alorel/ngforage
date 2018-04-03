module.exports = function (prog, args = [], opts = {}) {
  opts = Object.assign({
    env: process.env,
    cwd: process.cwd(),
    stdio: 'inherit'
  }, opts);

  return new Promise((resolve, reject) => {
    let errored = false;
    const spawn = require('cross-spawn');

    const proc = spawn(prog, args, opts);

    proc.once('error', e => {
      errored = true;
      reject(e);
    });

    proc.once('exit', code => {
      if (!errored) {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Exited with code ${code}`));
        }
      }
    })
  })
}
