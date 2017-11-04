import {Injectable} from "@angular/core";
import {NgForage} from "../main/NgForage.service";
import {FullyConfigurable} from "../config/FullyConfigurable";
import {CachedItem} from "./CachedItem";
import {CachedItemImpl} from "./CachedItemImpl";

/** @internal */
interface CacheKeys {
  data: string;
  expiry: string;
}

/** @internal */
function calculateCacheKeys(mainKey: string): CacheKeys {
  return {
    data: `${mainKey}_data`,
    expiry: `${mainKey}_expiry`
  };
}

/** @internal */
function toCachedItem<T>(r: [T, number]) {
  return new CachedItemImpl<T>(r[0], r[1]);
}

/** @internal */
function head<T>(r: [T, number]) {
  return r[0];
}

/** @internal */
function toVoid() {

}

@Injectable()
export class NgForageCache extends NgForage implements FullyConfigurable {

  /**
   * Cache time in milliseconds
   * @default 300000
   * @return {number}
   */
  get cacheTime(): number {
    return 'cacheTime' in this.config ? this.config.cacheTime : this.baseConfig.cacheTime;
  }

  /**
   * Cache time in milliseconds
   * @default 300000
   * @param {number} t New cache time
   */
  set cacheTime(t: number) {
    this.config.cacheTime = t;
    this.storeNeedsRecalc = true;
  }

  getCached<T>(key: string): Promise<CachedItem<T>> {
    const keys = calculateCacheKeys(key);
    const dataPromise = this.getItem<T>(keys.data);
    const expiryPromise = this.getItem<number>(keys.expiry);

    return Promise.all([dataPromise, expiryPromise]).then(toCachedItem);
  }

  setCached<T>(key: string, data: T, cacheTime?: number): Promise<T> {
    const keys = calculateCacheKeys(key);
    const expiry = typeof cacheTime === 'number' ? cacheTime : this.cacheTime;

    const dataPromise = this.setItem<T>(keys.data, data);
    const expiryPromise = this.setItem<number>(keys.expiry, expiry);

    return Promise.all([dataPromise, expiryPromise]).then(head);
  }

  removeCached(key: string): Promise<void> {
    const keys = calculateCacheKeys(key);

    const dataPromise = this.removeItem(keys.data);
    const expiryPromise = this.removeItem(keys.expiry);

    return Promise.all([dataPromise, expiryPromise]).then(toVoid);
  }
}