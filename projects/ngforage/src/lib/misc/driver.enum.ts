import {localForage as lf} from '../imports/localforage';

export enum Driver {
  /** The IndexedDB driver */
  INDEXED_DB = <any>lf.INDEXEDDB,
  /** The localStorage driver */
  LOCAL_STORAGE = <any>lf.LOCALSTORAGE,
  /** The WebSQL driver */
  WEB_SQL = <any>lf.WEBSQL
}

// for (const d of [lf.INDEXEDDB, lf.LOCALSTORAGE, _driver, lf.WEBSQL]) {
//   delete Driver[d];
// }

Object.freeze(Driver);
