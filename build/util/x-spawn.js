const spawn = require('cross-spawn');
const {merge} = require('lodash');

module.exports = (command, args = [], opts = {}, stdinWrite) => {
  return new Promise((resolve, reject) => {
    let errored = false;
    opts = merge({
      env: process.env,
      stdio: 'inherit',
      cwd: process.cwd()
    }, opts);

    const kid = spawn(command, args, opts)
      .once('error', e => {
        errored = true;
        reject(e);
      })
      .once('exit', code => {
        if (!errored) {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Exited with ${code}`))
          }
        }
      });

    if (stdinWrite) {
      kid.stdin.write(stdinWrite);
    }
  });
};
