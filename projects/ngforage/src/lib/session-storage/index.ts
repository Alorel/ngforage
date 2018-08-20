import {localForage as lf} from '../imports/localforage';
import {_initStorage} from './_initStorage';
import {_isSessionStorageUsable} from './_isSessionStorageUsable';
import {clear} from './clear';
import {dropInstance} from './dropInstance';
import {getItem} from './getItem';
import {iterate} from './iterate';
import {key} from './key';
import {keys} from './keys';
import {length} from './length';
import {removeItem} from './removeItem';
import {setItem} from './setItem';

/** @internal */
export const _driver = 'ngforage_sessionStorage';

/** @internal */
const sessionStorageWrapper: LocalForageDriver = {
  _driver,
  _initStorage,
  _support: _isSessionStorageUsable(),
  clear,
  dropInstance,
  getItem,
  iterate,
  key,
  keys,
  length,
  removeItem,
  setItem
};

//tslint:disable-next-line:no-unbound-method
lf.defineDriver(sessionStorageWrapper).catch(console.error);
