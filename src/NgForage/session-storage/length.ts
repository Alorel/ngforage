import {executeCallback} from './executeCallback';

/** @internal */
export function length(this: any, callback?: any) {
  const promise = this.keys().then((keys$: any[]) => keys$.length);

  executeCallback(promise, callback);

  return promise;
}
