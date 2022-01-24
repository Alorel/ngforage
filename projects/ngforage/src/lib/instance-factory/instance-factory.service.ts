import {Injectable} from '@angular/core';
import 'localforage';
import type {NgForageOptions} from '../config';
import {NgForageConfig} from '../config/ng-forage-config.service';
import {localForage as lf} from '../imports/localforage';
import {DriverType} from '../misc/driver-type.type';

/** @internal */
const stores = new Map<string, LocalForage>();

/** @internal */
function getDriverString(driver?: DriverType | DriverType[]): string {
  if (!driver) {
    return '';
  } else if (Array.isArray(driver)) {
    return driver.slice().sort().join(',');
  } else {
    return <string>driver;
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
  private readonly [conf$]: NgForageConfig;

  public constructor(conf: NgForageConfig) {
    this[conf$] = conf;
  }

  public getInstance(cfg: NgForageOptions): LocalForage {
    const resolvedCfg = {...this[conf$].config, ...cfg};
    const hash = getHash(resolvedCfg);

    const existing = stores.get(hash);
    if (existing) {
      return existing;
    }

    const nu = lf.createInstance(resolvedCfg as LocalForageOptions);
    const origDropInstance = nu.dropInstance;
    nu.dropInstance = function (this: LocalForage) {
      stores.delete(hash);
      return origDropInstance.apply(this, arguments as any);
    };

    stores.set(hash, nu);

    return nu;
  }
}
