import {Injectable} from '@angular/core';
import type {NgForageOptions} from '../config';
import {CacheConfigurable} from '../config';
import {NgForage} from '../main';
import type {CachedItem} from './cached-item';
import {CachedItemImpl} from './cached-item-impl.class';

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

/**
 * An extension of {@link NgForage} which adds expiration support
 */
@Injectable({providedIn: 'root'})
export class NgForageCache extends NgForage implements CacheConfigurable {

  /**
   * Cache time in milliseconds
   * @default 300000
   */
  public get cacheTime(): number {
    return this.config.cacheTime ?? this.baseConfig.cacheTime;
  }

  public set cacheTime(t: number) {
    this.config.cacheTime = t;
    this.storeNeedsRecalc = true;
  }

  /** @inheritDoc */
  public override clone(config?: NgForageOptions): NgForageCache {
    const inst = new NgForageCache(this.baseConfig, this.fact);
    inst.configure({...this.finalConfig, ...config});

    return inst;
  }

  /**
   * Retrieve data
   * @param key Data key
   */
  public async getCached<T>(key: string): Promise<CachedItem<T>> {
    const keys = calculateCacheKeys(key);

    const [data, expiry] = await Promise
      .all([this.getItem<T>(keys.data), this.getItem<number>(keys.expiry)]);

    return new CachedItemImpl<T>(data!, expiry!);
  }

  /**
   * Remove data
   * @param key Data key
   */
  public async removeCached(key: string): Promise<void> {
    const keys = calculateCacheKeys(key);
    await Promise
      .all([this.removeItem(keys.data), this.removeItem(keys.expiry)]);
  }

  /**
   * Set data
   * @param key Data key
   * @param data Data to set
   * @param [cacheTime] Override cache set in {@link CacheConfigurable#cacheTime global or instance config}.
   */
  public async setCached<T>(key: string, data: T, cacheTime: number = this.cacheTime): Promise<T> {
    const keys = calculateCacheKeys(key);

    const [out] = await Promise
      .all([this.setItem<T>(keys.data, data), this.setItem(keys.expiry, Date.now() + cacheTime)]);

    return out;
  }

  /** @internal */
  public override toJSON(): NgForageOptions {
    return Object.assign(super.toJSON() as NgForageOptions, {cacheTime: this.cacheTime});
  }
}
