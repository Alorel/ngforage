import {executeCallback} from './executeCallback';

/** @internal */
export function iterate(this: any, iterator: any, callback?: any) {
  const promise = this.ready().then(() => {
    const keyPrefix = this._dbInfo.keyPrefix;
    const keyPrefixLength = keyPrefix.length;
    const length$ = sessionStorage.length;

    // We use a dedicated iterator instead of the `i` variable below
    // so other keys we fetch in sessionStorage aren't counted in
    // the `iterationNumber` argument passed to the `iterate()`
    // callback.
    //
    // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
    let iterationNumber = 1;

    for (let i = 0; i < length$; i++) {
      const key$ = sessionStorage.key(i);
      if (key$ === null || key$.indexOf(keyPrefix) !== 0) {
        continue;
      }
      let value = sessionStorage.getItem(key$);

      // If a result was found, parse it from the serialized
      // string into a JS object. If result isn't truthy, the
      // key is likely undefined and we'll pass it straight
      // to the iterator.
      if (value) {
        value = this._dbInfo.serializer.deserialize(value);
      }

      value = iterator(
        value,
        key$.substring(keyPrefixLength),
        iterationNumber++
      );

      if (value !== void 0) {
        return value;
      }
    }
  });

  executeCallback(promise, callback);

  return promise;
}
