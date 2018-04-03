import {executeCallback} from './executeCallback';

/** @internal */
export function keys(this: any, callback?: any) {
  const promise = this.ready().then(() => {
    const length$ = sessionStorage.length;
    const keys$: any[] = [];

    for (let i = 0; i < length$; i++) {
      const itemKey = sessionStorage.key(i);
      if (itemKey !== null && itemKey.indexOf(this._dbInfo.keyPrefix) === 0) {
        keys$.push(itemKey.substring(this._dbInfo.keyPrefix.length));
      }
    }

    return keys$;
  });

  executeCallback(promise, callback);

  return promise;
}
