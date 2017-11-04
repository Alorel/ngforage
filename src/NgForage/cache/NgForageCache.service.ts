import {Injectable} from "@angular/core";
import {NgForage} from "../main/NgForage.service";
import {CacheConfigurable} from "../config/CacheConfigurable";
import {CachedItem} from "./CachedItem";
import {CachedItemImpl} from "./CachedItemImpl";
import {NgForageOptions} from "../config/NgForageOptions";
import {addToStringTag} from "../util/addToStringTag";

interface CacheKeys {
  data: string;
  expiry: string;
}

function calculateCacheKeys(mainKey: string): CacheKeys {
  return {
    data: `${mainKey}_data`,
    expiry: `${mainKey}_expiry`
  };
}

function toCachedItem<T>(r: [T, number]) {
  return new CachedItemImpl<T>(r[0], r[1]);
}

function head<T>(r: [T, number]) {
  return r[0];
}

function toVoid() {

}

/**
 * An extension of {@link NgForage} which adds expiration support
 */
@Injectable()
export class NgForageCache extends NgForage implements CacheConfigurable {

  /**
   * Cache time in milliseconds
   * @default 300000
   */
  get cacheTime(): number {
    return 'cacheTime' in this.config ? this.config.cacheTime : this.baseConfig.cacheTime;
  }

  set cacheTime(t: number) {
    this.config.cacheTime = t;
    this.storeNeedsRecalc = true;
  }

  /**
   * Retrieve data
   * @param {string} key Data key
   * @return {Promise<CachedItem<T>>}
   */
  getCached<T>(key: string): Promise<CachedItem<T>> {
    const keys = calculateCacheKeys(key);
    const dataPromise = this.getItem<T>(keys.data);
    const expiryPromise = this.getItem<number>(keys.expiry);

    return Promise.all([dataPromise, expiryPromise]).then(toCachedItem);
  }

  /**
   * Set data
   * @param {string} key Data key
   * @param {T} data Data to set
   * @param {number} [cacheTime] Override cache set in {@link CacheConfigurable#cacheTime global or instance config}.
   * @return {Promise<T>}
   */
  setCached<T>(key: string, data: T, cacheTime?: number): Promise<T> {
    const keys = calculateCacheKeys(key);
    const expiry = typeof cacheTime === 'number' ? cacheTime : this.cacheTime;

    const dataPromise = this.setItem<T>(keys.data, data);
    const expiryPromise = this.setItem<number>(keys.expiry, Date.now() + expiry);

    return Promise.all([dataPromise, expiryPromise]).then(head);
  }

  /**
   * Remove data
   * @param {string} key Data key
   * @return {Promise<void>}
   */
  removeCached(key: string): Promise<void> {
    const keys = calculateCacheKeys(key);

    const dataPromise = this.removeItem(keys.data);
    const expiryPromise = this.removeItem(keys.expiry);

    return Promise.all([dataPromise, expiryPromise]).then(toVoid);
  }

  /** @internal */
  toJSON(): NgForageOptions {
    return Object.assign(super.toJSON(), {
      cacheTime: this.cacheTime
    } as Partial<NgForageOptions>)
  }
}

addToStringTag(NgForageCache, 'NgForageCache');