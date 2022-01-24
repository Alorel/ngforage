import {Injectable} from '@angular/core';
import {BaseConfigurableImpl} from '../config';
import type {BaseConfigurable, NgForageOptions} from '../config';
import type {DriverType} from '../misc/driver-type.type';
import {Driver} from '../misc/driver.enum';

/**
 * Cache instance
 */
@Injectable({providedIn: 'root'})
export class NgForage extends BaseConfigurableImpl implements BaseConfigurable {

  /**
   * Returns the name of the driver being used, or null if none can be used.
   */
  public get activeDriver(): DriverType {
    return this.store.driver();
  }

  /**
   * When invoked with no arguments, it drops the “store” of the current instance. When invoked with an object
   * specifying both name and storeName properties, it drops the specified “store”. When invoked with an object
   * specifying only a name property, it drops the specified “database” (and all its stores).
   */
  public async dropInstance(cfg?: LocalForageDbInstanceOptions): Promise<void> {
    return await (cfg ? this.store.dropInstance(cfg) : this.store.dropInstance());
  }

  /**
   * Removes every key from the database, returning it to a blank slate.
   *
   * clear() will remove <b>every item in the offline store</b>. Use this method with caution.
   */
  public async clear(): Promise<void> {
    return await this.store.clear();
  }

  /**
   * Make a clone of the instance
   * @param config Optional configuration
   */
  public clone(config?: NgForageOptions): NgForage {
    const inst = new NgForage(this.baseConfig, this.fact);
    inst.configure({...this.finalConfig, ...config});

    return inst;
  }

  /**
   * Gets an item from the storage library.
   * If the key does not exist, getItem() will return null.
   * @param key Data key
   */
  public async getItem<T>(key: string): Promise<T | null> {
    return await this.store.getItem<T>(key);
  }

  /**
   * Iterate over all value/key pairs in datastore.
   * <i>iteratee</i> is called once for each pair, with the following arguments:
   * <ol>
   *   <li>Value</li>
   *   <li>Key</li>
   *   <li>iterationNumber - one-based number</li>
   * </ol>
   * iterate() supports early exit by returning non undefined value inside iteratorCallback callback.
   * @param iteratee
   */
  public async iterate<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U): Promise<U> {
    return await this.store.iterate(iteratee);
  }

  /**
   * Get the name of a key based on its ID.
   * @param index
   */
  public async key(index: number): Promise<string> {
    return await this.store.key(index);
  }

  /**
   * Get the list of all keys in the datastore.
   */
  public async keys(): Promise<string[]> {
    return await this.store.keys();
  }

  /**
   * Gets the number of keys in the offline store (i.e. its “length”).
   */
  public async length(): Promise<number> {
    return await this.store.length();
  }

  /**
   * Even though localForage queues up all of its data API method calls,
   * ready() provides a way to determine whether the asynchronous driver initialization process has finished.
   * That’s useful in cases like when we want to know which driver localForage has settled down using.
   */
  public async ready(): Promise<void> {
    return await this.store.ready();
  }

  /**
   * Removes the value of a key from the offline store.
   * @param key Data key
   */
  public async removeItem(key: string): Promise<void> {
    return await this.store.removeItem(key);
  }

  /**
   * Saves data to an offline store. You can store the following types of JavaScript objects:
   * <ul>
   *  <li>Array</li>
   *  <li>ArrayBuffer</li>
   *  <li>Blob</li>
   *  <li>Float32Array</li>
   *  <li>Float64Array</li>
   *  <li>Int8Array</li>
   *  <li>Int16Array</li>
   *  <li>Int32Array</li>
   *  <li>Number</li>
   *  <li>Object</li>
   *  <li>Uint8Array</li>
   *  <li>Uint8ClampedArray</li>
   *  <li>Uint16Array</li>
   *  <li>Uint32Array</li>
   *  <li>String</li>
   * </ul>
   * @param key Data key
   * @param data Data
   */
  public async setItem<T>(key: string, data: T): Promise<T> {
    return await this.store.setItem<T>(key, data);
  }

  /**
   * Check whether the given driver is supported/registered.
   * @param driver Driver name
   */
  public supports(driver: Driver | string): boolean {
    return this.store.supports(<string>driver);
  }
}
