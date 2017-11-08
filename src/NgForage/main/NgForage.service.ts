import {Injectable} from '@angular/core';
import {BaseConfigurable} from '../config/BaseConfigurable';
import {BaseConfigurableImpl} from '../config/BaseConfigurableImpl.service';
import {addToStringTag} from '../util/addToStringTag';

/**
 * Cache instance
 */
@Injectable()
export class NgForage extends BaseConfigurableImpl implements BaseConfigurable {

  /**
   * Gets an item from the storage library.
   * If the key does not exist, getItem() will return null.
   * @param {string} key Data key
   * @return {Promise<T>}
   */
  public getItem<T>(key: string): Promise<T> {
    return this.store.getItem<T>(key);
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
   * @param {string} key Data key
   * @param {T} data Data
   * @return {Promise<T>}
   */
  public setItem<T>(key: string, data: T): Promise<T> {
    return this.store.setItem<T>(key, data);
  }

  /**
   * Removes the value of a key from the offline store.
   * @param {string} key Data key
   * @return {Promise<void>}
   */
  public removeItem(key: string): Promise<void> {
    return this.store.removeItem(key);
  }

  /**
   * Removes every key from the database, returning it to a blank slate.
   *
   * clear() will remove <b>every item in the offline store</b>. Use this method with caution.
   * @return {Promise<void>}
   */
  public clear(): Promise<void> {
    return this.store.clear();
  }

  /**
   * Gets the number of keys in the offline store (i.e. its “length”).
   * @return {Promise<number>}
   */
  public length(): Promise<number> {
    return this.store.length();
  }

  /**
   * Get the name of a key based on its ID.
   * @param {number} index
   * @return {Promise<string>}
   */
  public key(index: number): Promise<string> {
    return this.store.key(index);
  }

  /**
   * Get the list of all keys in the datastore.
   * @return {Promise<string[]>}
   */
  public keys(): Promise<string[]> {
    return this.store.keys();
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
   * @param {(value: T, key: string, iterationNumber: number) => U} iteratee
   * @return {Promise<U>}
   */
  public iterate<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U): Promise<U> {
    return this.store.iterate(iteratee);
  }

  /**
   * Returns the name of the driver being used, or null if none can be used.
   * @return {string}
   */
  public get activeDriver(): string {
    return this.store.driver();
  }

  /**
   * Check whether the given driver is supported/registered.
   * @param {string} driver Driver name
   * @return {boolean}
   */
  public supports(driver: string): boolean {
    return this.store.supports(driver);
  }

  /**
   * Even though localForage queues up all of its data API method calls,
   * ready() provides a way to determine whether the asynchronous driver initialization process has finished.
   * That’s useful in cases like when we want to know which driver localForage has settled down using.
   * @return {Promise<void>}
   */
  public ready(): Promise<void> {
    return this.store.ready();
  }
}

addToStringTag(NgForage, 'NgForage');
