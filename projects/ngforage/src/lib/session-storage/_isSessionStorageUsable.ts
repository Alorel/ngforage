import {checkIfSessionStorageThrows} from './checkIfSessionStorageThrows';

/** @internal */
export function _isSessionStorageUsable() {
  return typeof sessionStorage !== 'undefined' && (!checkIfSessionStorageThrows() || sessionStorage.length > 0);
}
