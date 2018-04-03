import {executeCallback} from './executeCallback';
import {normalizeKey} from './normalizeKey';

/** @internal */
export function setItem(this: any, key$: string, value: any, callback?: any) {
  key$ = normalizeKey(key$);

  const promise = this.ready().then(() => {
    // Convert undefined values to null.
    // https://github.com/mozilla/localForage/pull/42
    if (value === undefined) {
      value = null;
    }

    // Save the original value to pass to the callback.
    const originalValue = value;

    return new Promise<any>((resolve, reject) => {
      this._dbInfo.serializer.serialize(value, (value$: string, error: Error) => {
        if (error) {
          reject(error);
        } else {
          try {
            sessionStorage.setItem(`${this._dbInfo.keyPrefix}${key$}`, value$);
            resolve(originalValue);
          } catch (e) {
            // sessionStorage capacity exceeded.
            if (
              e.name === 'QuotaExceededError' ||
              e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
            ) {
              reject(e);
            }
            reject(e);
          }
        }
      });
    });
  });

  executeCallback(promise, callback);

  return promise;
}
