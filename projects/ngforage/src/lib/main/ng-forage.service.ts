import {Injectable} from '@angular/core';
import {BaseConfigurable} from '../config/base-configurable';
import {BaseConfigurableImpl} from '../config/base-configurable-impl.service';
import {NgForageOptions} from '../config/ng-forage-options';
import {DriverType} from '../misc/driver-type.type';
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
   * Removes every key from the database, returning it to a blank slate.
   *
   * clear() will remove <b>every item in the offline store</b>. Use this method with caution.
   */
  public clear(): Promise<void> {
    return this.store.clear();
  }

  /**
   * Make a clone of the instance
   * @param config Optional configuration
   */
  public clone(config?: NgForageOptions): NgForage {
    const inst = new NgForage(this.baseConfig, this.fact);
    inst.configure(Object.assign(this.finalConfig, config || {}));

    return inst;
  }

  /**
   * Gets an item from the storage library.
   * If the key does not exist, getItem() will return null.
   * @param key Data key
   */
  public getItem<T>(key: string): Promise<T | null> {
    return this.store.getItem<T>(key);
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
  public iterate<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U): Promise<U> {
    return this.store.iterate(iteratee);
  }

  /**
   * Get the name of a key based on its ID.
   * @param index
   */
  public key(index: number): Promise<string> {
    return this.store.key(index);
  }

  /**
   * Get the list of all keys in the datastore.
   */
  public keys(): Promise<string[]> {
    return this.store.keys();
  }

  /**
   * Gets the number of keys in the offline store (i.e. its “length”).
   */
  public length(): Promise<number> {
    return this.store.length();
  }

  /**
   * Even though localForage queues up all of its data API method calls,
   * ready() provides a way to determine whether the asynchronous driver initialization process has finished.
   * That’s useful in cases like when we want to know which driver localForage has settled down using.
   */
  public ready(): Promise<void> {
    return this.store.ready();
  }

  /**
   * Removes the value of a key from the offline store.
   * @param key Data key
   */
  public removeItem(key: string): Promise<void> {
    return this.store.removeItem(key);
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
  public setItem<T>(key: string, data: T): Promise<T> {
    return this.store.setItem<T>(key, data);
  }

  /**
   * Check whether the given driver is supported/registered.
   * @param driver Driver name
   */
  public supports(driver: Driver | string): boolean {
    return this.store.supports(<string>driver);
  }
}
