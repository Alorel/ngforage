import {FactoryProvider, Injectable} from '@angular/core';
import * as lf from 'localforage';
import {NgForageOptions} from '../config/NgForageOptions';

/** @internal */
let instance: InstanceFactory;

/** @internal */
interface InstanceMap {
  [hash: string]: LocalForage;
}

/** @internal */
const stores: InstanceMap = {};

/** @internal */
function getDriverString(driver?: string | string[]) {
  if (!driver) {
    return '';
  } else if (typeof driver === 'string') {
    return driver;
  } else {
    return driver.slice().sort().join(',');
  }
}

/** @internal */
function getHash(cfg: NgForageOptions): string {
  return [
    getDriverString(cfg.driver),
    cfg.name,
    cfg.size,
    cfg.storeName,
    cfg.version,
    cfg.description,
    cfg.cacheTime
  ].join('|');
}

/** @internal */
@Injectable()
export class InstanceFactory {

  public static readonly provider: FactoryProvider = {
    provide: InstanceFactory,
    useFactory: InstanceFactory.factory
  };

  public static factory(): InstanceFactory {
    if (!instance) {
      instance = new InstanceFactory();
    }

    return instance;
  }

  public getInstance(cfg: NgForageOptions): LocalForage {
    const hash = getHash(cfg);

    if (!stores[hash]) {
      stores[hash] = lf.createInstance(cfg);
    }

    return stores[hash];
  }
}
