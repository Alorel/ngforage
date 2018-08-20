import {_getKeyPrefix} from './_getKeyPrefix';
import {executeCallback} from './executeCallback';
import {getCallback} from './getCallback';

/** @internal */
export function dropInstance(this: any, options: any, callback?: any) {
  callback = getCallback.apply(this, arguments);

  options = (typeof options !== 'function' && options) || {};
  if (!options.name) {
    const currentConfig = this.config();
    options.name = options.name || currentConfig.name;
    options.storeName = options.storeName || currentConfig.storeName;
  }

  let promise: Promise<void>;
  if (!options.name) {
    promise = Promise.reject('Invalid arguments');
  } else {
    promise = new Promise<string>(resolve => {
      if (!options.storeName) {
        resolve(`${options.name}/`);
      } else {
        resolve(_getKeyPrefix(options, this._defaultConfig));
      }
    })
      .then((keyPrefix: any) => {
        for (let i = sessionStorage.length - 1; i >= 0; i--) {
          const key$ = sessionStorage.key(i);

          if (key$ !== null && key$.indexOf(keyPrefix) === 0) {
            sessionStorage.removeItem(key$);
          }
        }
      });
  }

  executeCallback(promise, callback);

  return promise;
}
