import {Injectable} from '@angular/core';
import {CacheConfigurable} from '../config/CacheConfigurable';
import {NgForageOptions} from '../config/NgForageOptions';
import {NgForage} from '../main/NgForage.service';
import {addToStringTag} from '../util/addToStringTag';
import {CachedItem} from './CachedItem';
import {CachedItemImpl} from './CachedItemImpl';

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
// tslint:disable-next-line:no-empty
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
  public get cacheTime(): number {
    return 'cacheTime' in this.config ? this.config.cacheTime : this.baseConfig.cacheTime;
  }

  public set cacheTime(t: number) {
    this.config.cacheTime = t;
    this.storeNeedsRecalc = true;
  }

  /**
   * Retrieve data
   * @param key Data key
   */
  public getCached<T>(key: string): Promise<CachedItem<T>> {
    const keys = calculateCacheKeys(key);
    const dataPromise = this.getItem<T>(keys.data);
    const expiryPromise = this.getItem<number>(keys.expiry);

    return Promise.all([dataPromise, expiryPromise]).then(toCachedItem);
  }

  /**
   * Set data
   * @param key Data key
   * @param data Data to set
   * @param [cacheTime] Override cache set in {@link CacheConfigurable#cacheTime global or instance config}.
   */
  public setCached<T>(key: string, data: T, cacheTime?: number): Promise<T> {
    const keys = calculateCacheKeys(key);
    const expiry = typeof cacheTime === 'number' ? cacheTime : this.cacheTime;

    const dataPromise = this.setItem<T>(keys.data, data);
    const expiryPromise = this.setItem<number>(keys.expiry, Date.now() + expiry);

    return Promise.all([dataPromise, expiryPromise]).then(head);
  }

  /**
   * Remove data
   * @param key Data key
   */
  public removeCached(key: string): Promise<void> {
    const keys = calculateCacheKeys(key);

    const dataPromise = this.removeItem(keys.data);
    const expiryPromise = this.removeItem(keys.expiry);

    return Promise.all([dataPromise, expiryPromise]).then(toVoid);
  }

  /** @internal */
  public toJSON(): NgForageOptions {
    const ass: Partial<NgForageOptions> = {cacheTime: this.cacheTime};

    return Object.assign(super.toJSON(), ass);
  }
}

addToStringTag(NgForageCache, 'NgForageCache');
