import {Injectable} from "@angular/core";
import * as lf from 'localforage';
import {NgForageOptions} from "./NgForageOptions";
import {CacheConfigurable} from "./CacheConfigurable";
import {BaseConfigurable} from "./BaseConfigurable";
import {addToStringTag} from "../util/addToStringTag";

let instance: NgForageConfig;

const config: NgForageOptions = {
  driver: [lf.INDEXEDDB, lf.WEBSQL, lf.LOCALSTORAGE],
  name: 'ngForage',
  size: 4980736,
  storeName: 'ng_forage',
  version: 1.0,
  description: '',
  cacheTime: 300000
};

/**
 * Global/default configuration
 */
@Injectable()
export class NgForageConfig implements BaseConfigurable, CacheConfigurable {

  /** The IndexedDB driver */
  static readonly DRIVER_INDEXEDDB: string = lf.INDEXEDDB;
  /** The WebSQL driver */
  static readonly DRIVER_WEBSQL: string = lf.WEBSQL;
  /** The localStorage driver */
  static readonly DRIVER_LOCALSTORAGE: string = lf.LOCALSTORAGE;

  /** @inheritDoc */
  configure(opts: NgForageOptions): this {
    opts = opts || {};

    if ('driver' in opts && opts.driver.slice) {
      opts.driver = opts.driver.slice();
    }

    Object.assign(config, opts);
    return this;
  }

  /**
   * Cache time in milliseconds
   * @default 300000
   * @return {number}
   */
  get cacheTime(): number {
    return config.cacheTime;
  }

  set cacheTime(t: number) {
    config.cacheTime = t;
  }

  /**
   * The preferred driver(s) to use.
   * @see {@link NgForageConfig#DRIVER_INDEXEDDB}
   * @see {@link NgForageConfig#DRIVER_WEBSQL}
   * @see {@link NgForageConfig#DRIVER_LOCALSTORAGE}
   * @default [{@link NgForageConfig#DRIVER_INDEXEDDB IndexedDB}, {@link NgForageConfig#DRIVER_INDEXEDDB WebSQL}, {@link NgForageConfig#DRIVER_LOCALSTORAGE localStorage}]
   * @return {string | string[]}
   */
  get driver(): string | string[] {
    if (typeof config.driver === 'string') {
      return config.driver;
    }

    return config.driver.slice();
  }

  set driver(v: string | string[]) {
    config.driver = v;
  }

  /**
   * The name of the database. May appear during storage limit prompts. Useful to use the name of your app here.
   * In localStorage, this is used as a key prefix for all keys stored in localStorage.
   * @default ngForage
   * @return {string}
   */
  get name(): string {
    return config.name;
  }

  set name(v: string) {
    config.name = v;
  }

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * @default 4980736
   * @return {number}
   */
  get size(): number {
    return config.size;
  }

  set size(v: number) {
    config.size = v;
  }

  /**
   * The name of the datastore.
   * In IndexedDB this is the dataStore,
   * in WebSQL this is the name of the key/value table in the database.
   * Must be alphanumeric, with underscores.
   * Any non-alphanumeric characters will be converted to underscores.
   * @default ng_forage
   * @return {string}
   */
  get storeName(): string {
    return config.storeName;
  }

  set storeName(v: string) {
    config.storeName = v;
  }

  /**
   * The version of your database. May be used for upgrades in the future; currently unused.
   * @default 1.0
   * @return {number}
   */
  get version(): number {
    return config.version;
  }

  set version(v: number) {
    config.version = v;
  }

  /**
   * A description of the database, essentially for developer usage.
   * @default
   * @return {string}
   */
  get description(): string {
    return config.description;
  }

  set description(v: string) {
    config.description = v;
  }

  /**
   * Define a driver
   *
   * You’ll want to make sure you accept a callback argument and that you pass the same arguments to callbacks as the default drivers do.
   * You’ll also want to resolve or reject promises.
   * Check any of the {@link https://github.com/mozilla/localForage/tree/master/src/drivers default drivers} for an idea
   * of how to implement your own, custom driver.
   * @param {LocalForageDriver} spec Driver spec
   * @return {Promise<void>}
   */
  defineDriver(spec: LocalForageDriver): Promise<void> {
    return lf.defineDriver(spec);
  }

  /**
   * Get the compiled configuration
   * @return {NgForageOptions}
   */
  get config(): NgForageOptions {
    return {
      driver: this.driver,
      name: this.name,
      size: this.size,
      storeName: this.storeName,
      version: this.version,
      description: this.description,
      cacheTime: this.cacheTime
    };
  }

  /** @internal */
  toJSON(): NgForageOptions {
    return this.config;
  }

  /** @internal */
  static factory(): NgForageConfig {
    if (!instance) {
      instance = new NgForageConfig();
    }

    return instance;
  }
}

addToStringTag(NgForageConfig, 'NgForageConfig');