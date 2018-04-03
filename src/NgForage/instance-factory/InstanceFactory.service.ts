import {FactoryProvider, Injectable} from '@angular/core';
import 'localforage';
import {NgForageConfig} from '../config/NgForageConfig.service';
import {NgForageOptions} from '../config/NgForageOptions';
import {localForage as lf} from '../imports/localforage';

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

/**
 * Creates localForage instances
 */
@Injectable()
export class InstanceFactory {

  /** @internal */
  public static readonly provider: FactoryProvider = {
    deps: [NgForageConfig],
    provide: InstanceFactory,
    useFactory: InstanceFactory.factory
  };
  /** @internal */
  private readonly conf: NgForageConfig;

  /** @internal */
  private constructor(conf: NgForageConfig) {
    this.conf = conf;
  }

  public static factory(conf: NgForageConfig): InstanceFactory {
    if (!instance) {
      instance = new InstanceFactory(conf);
    }

    return instance;
  }

  public getInstance(cfg: NgForageOptions): LocalForage {
    cfg = Object.assign(this.conf.config, cfg || {});
    const hash = getHash(cfg);

    if (!stores[hash]) {
      stores[hash] = lf.createInstance(cfg);
    }

    return stores[hash];
  }
}
