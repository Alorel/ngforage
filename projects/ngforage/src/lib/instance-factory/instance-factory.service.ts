import {Injectable} from '@angular/core';
import 'localforage';
import {Proto} from 'typescript-proto-decorator';
import {NgForageConfig} from '../config/ng-forage-config.service';
import {NgForageOptions} from '../config/ng-forage-options';
import {localForage as lf} from '../imports/localforage';
import {NC_NE_NW} from '../misc/std-descriptors';

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
@Injectable({providedIn: 'root'})
export class InstanceFactory {
  /** @internal */
  @Proto('InstanceFactory', NC_NE_NW)
  public readonly [Symbol.toStringTag]: string;

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