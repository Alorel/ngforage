import {localForage as lf} from '../imports/localforage';

/** ngforage abstraction over localforage driver names */
enum Driver {
  /** The IndexedDB driver */
  INDEXED_DB = <any>lf.INDEXEDDB,
  /** The localStorage driver */
  LOCAL_STORAGE = <any>lf.LOCALSTORAGE,
  /** The WebSQL driver */
  WEB_SQL = <any>lf.WEBSQL
}

// Clean up after Typescript's two-way enum transpiling
for (const d of [lf.INDEXEDDB, lf.LOCALSTORAGE, lf.WEBSQL]) {
  delete (Driver as any)[d];
}

Object.freeze(Driver);

export {Driver};
