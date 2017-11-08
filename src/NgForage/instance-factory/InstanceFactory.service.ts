import {FactoryProvider, Injectable} from '@angular/core';
import * as lf from 'localforage';
import {NgForageOptions} from '../config/NgForageOptions';

let instance: InstanceFactory;

interface InstanceMap {
  [hash: string]: LocalForage;
}

const stores: InstanceMap = {};

function getDriverString(driver?: string | string[]) {
  if (!driver) {
    return '';
  } else if (typeof driver === 'string') {
    return driver;
  } else {
    return driver.slice().sort().join(',');
  }
}

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

  private static factory(): InstanceFactory {
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
