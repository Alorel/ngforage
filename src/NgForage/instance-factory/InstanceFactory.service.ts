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

/** @internal */
const conf$ = Symbol('Config');

/**
 * Creates localForage instances
 */
export class InstanceFactory {

  /** @internal */
  public constructor(conf: NgForageConfig) {
    this[conf$] = conf;
  }

  public getInstance(cfg: NgForageOptions): LocalForage {
    cfg = Object.assign({}, this[conf$].config, cfg || {});
    const hash = getHash(cfg);

    if (!stores[hash]) {
      stores[hash] = lf.createInstance(cfg);
    }

    return stores[hash];
  }
}

Object.defineProperty(InstanceFactory.prototype, Symbol.toStringTag, {value: 'InstanceFactory'});

/** @internal */
export function _$factory$(conf: NgForageConfig): InstanceFactory {
  if (!instance) {
    instance = new InstanceFactory(conf);
  }

  return instance;
}
