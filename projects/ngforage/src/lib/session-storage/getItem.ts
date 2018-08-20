import {executeCallback} from './executeCallback';
import {normalizeKey} from './normalizeKey';

/** @internal */
export function getItem(this: any, key$: string, callback?: any) {
  key$ = normalizeKey(key$);

  const promise = this.ready().then(() => {
    let result = sessionStorage.getItem(`${this._dbInfo.keyPrefix}${key$}`);

    // If a result was found, parse it from the serialized
    // string into a JS object. If result isn't truthy, the key
    // is likely undefined and we'll pass it straight to the
    // callback.
    if (result) {
      result = this._dbInfo.serializer.deserialize(result);
    }

    return result;
  });

  executeCallback(promise, callback);

  return promise;
}
