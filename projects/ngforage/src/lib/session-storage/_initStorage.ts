import {serializer} from '../imports/serializer';
import {_getKeyPrefix} from './_getKeyPrefix';
import {_isSessionStorageUsable} from './_isSessionStorageUsable';

/** @internal */
export function _initStorage(this: any, options: LocalForageOptions) {
  const dbInfo: any = {};

  if (options) {
    for (let i in options) { //tslint:disable-line:forin
      dbInfo[i] = options[i];
    }
  }

  dbInfo.keyPrefix = _getKeyPrefix(options, this._defaultConfig);

  if (!_isSessionStorageUsable()) {
    return Promise.reject(new Error('Local storage unusable'));
  }

  this._dbInfo = dbInfo;
  dbInfo.serializer = serializer;

  return Promise.resolve();
}
