import {executeCallback} from './executeCallback';

/** @internal */
export function key(this: any, n: number, callback?: any) {
  const promise = this.ready().then(() => {
    let result: any;
    try {
      result = sessionStorage.key(n);
    } catch (error) {
      result = null;
    }

    // Remove the prefix from the key, if a key is found.
    if (result) {
      result = result.substring(this._dbInfo.keyPrefix.length);
    }

    return result;
  });

  executeCallback(promise, callback);

  return promise;
}
