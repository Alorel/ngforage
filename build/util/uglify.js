const {Transform} = require('stream');
const spawn = require('cross-spawn');
const worker = require('path').join(__dirname, 'uglify-worker.js');
const Promise = require('bluebird');

class GulpUglifyES extends Transform {

  constructor() {
    super({objectMode: true});
  }

  _transform(file, encoding, callback) {
    try {
      file = file.clone();
      GulpUglifyES.singleFile(file.contents.toString())
        .then(c => {
          file.contents = Buffer.from(c, 'utf8');
          callback(null, file);
        })
        .catch(e => callback(e));
    } catch (e) {
      setImmediate(callback, e);
    }
  }

  static singleFile(contents) {
    return new Promise((resolve, reject) => {
      let errored = false;
      let data;
      const child = spawn(process.execPath, [worker], {
        stdio: 'pipe',
        env: process.env,
        cwd: process.cwd()
      });

      child.once('error', e => {
        errored = true;
        reject(e);
      });
      child.stderr.on('data', d => {
        if (typeof d !== 'string') {
          d = d.toString();
        }

        process.stderr.write(d);
      });
      child.stdout.on('data', d => {
        data = d;
      });
      child.once('exit', code => {
        setImmediate(() => {
          if (!errored) {
            if (code === 0) {
              if (data !== undefined) {
                if (typeof data !== 'string') {
                  data = data.toString();
                }

                resolve(data);
              } else {
                reject(new Error('No data'));
              }
            } else {
              reject(new Error(`Exited with code ${code}`))
            }
          }
        });
      });

      child.stdin.write(contents);
      child.stdin.end();
    });
  }
}

module.exports = GulpUglifyES;