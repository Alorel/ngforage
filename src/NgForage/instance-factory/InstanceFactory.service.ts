import {Injectable} from "@angular/core";
import {NgForageOptions} from "../config/NgForageOptions";
import * as lf from 'localforage';

let instance: InstanceFactory;

/** @internal */
interface InstanceMap {
  [hash: string]: LocalForage
}

const stores: InstanceMap = {};

/** @internal */
@Injectable()
export class InstanceFactory {

  private static getDriverString(driver?: string | string[]) {
    if (!driver) {
      return '';
    } else if (typeof driver === 'string') {
      return driver;
    } else {
      return driver.slice().sort().join(',');
    }
  }

  private static getHash(cfg: NgForageOptions): string {
    return [
      InstanceFactory.getDriverString(cfg.driver),
      cfg.name,
      cfg.size,
      cfg.storeName,
      cfg.version,
      cfg.description,
      cfg.cacheTime
    ].join('|');
  }

  getInstance(cfg: NgForageOptions): LocalForage {
    const hash = InstanceFactory.getHash(cfg);

    if (!stores[hash]) {
      stores[hash] = lf.createInstance(cfg);
    }

    return stores[hash];
  }

  static factory(): InstanceFactory {
    if (!instance) {
      instance = new InstanceFactory();
    }

    return instance;
  }
}