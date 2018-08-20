import {executeCallback} from './executeCallback';
import {normalizeKey} from './normalizeKey';

/** @internal */
export function removeItem(this: any, key$: string, callback?: any) {
  key$ = normalizeKey(key$);

  const promise = this.ready().then(() => {
    sessionStorage.removeItem(`${this._dbInfo.keyPrefix}${key$}`);
  });

  executeCallback(promise, callback);

  return promise;
}
