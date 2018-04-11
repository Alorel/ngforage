import {checkIfSessionStorageThrows} from './checkIfSessionStorageThrows';

/** @internal */
export function _isSessionStorageUsable() {
    if (typeof sessionStorage !== 'undefined') {
        if( !checkIfSessionStorageThrows() || sessionStorage.length > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false
    }
}
