import {Injectable} from "@angular/core";
import * as lf from 'localforage';
import {NgForageOptions} from "./NgForageOptions";
import {FullyConfigurable} from "./FullyConfigurable";

let instance: NgForageConfig;

/**
 * Default configuration
 */
@Injectable()
export class NgForageConfig implements FullyConfigurable {

  /** The IndexedDB driver */
  static readonly DRIVER_INDEXEDDB: string = lf.INDEXEDDB;
  /** The WebSQL driver */
  static readonly DRIVER_WEBSQL: string = lf.WEBSQL;
  /** The localStorage driver */
  static readonly DRIVER_LOCALSTORAGE: string = lf.LOCALSTORAGE;

  /** @internal */
  private static readonly config: NgForageOptions = {
    driver: [lf.INDEXEDDB, lf.WEBSQL, lf.LOCALSTORAGE],
    name: 'ngForage',
    size: 4980736,
    storeName: 'ng_forage',
    version: 1.0,
    description: '',
    cacheTime: 300000
  };

  /** @inheritDoc */
  configure(opts: NgForageOptions): this {
    Object.assign(NgForageConfig.config, opts || {});
    return this;
  }

  /**
   * Cache time in milliseconds
   * @default 300000
   * @return {number}
   */
  get cacheTime(): number {
    return NgForageConfig.config.cacheTime;
  }

  /**
   * Cache time in milliseconds
   * @default 300000
   * @param {number} t New cache time
   */
  set cacheTime(t: number) {
    NgForageConfig.config.cacheTime = t;
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
    if (typeof NgForageConfig.config.driver === 'string') {
      return NgForageConfig.config.driver;
    }

    return NgForageConfig.config.driver.slice();
  }

  /**
   * The preferred driver(s) to use.
   * @param {string | string[]} v Driver name(s)
   * @see {@link NgForageConfig#DRIVER_INDEXEDDB}
   * @see {@link NgForageConfig#DRIVER_WEBSQL}
   * @see {@link NgForageConfig#DRIVER_LOCALSTORAGE}
   * @default [{@link NgForageConfig#DRIVER_INDEXEDDB IndexedDB}, {@link NgForageConfig#DRIVER_INDEXEDDB WebSQL}, {@link NgForageConfig#DRIVER_LOCALSTORAGE localStorage}]
   */
  set driver(v: string | string[]) {
    NgForageConfig.config.driver = v;
  }

  /**
   * The name of the database. May appear during storage limit prompts. Useful to use the name of your app here.
   * In localStorage, this is used as a key prefix for all keys stored in localStorage.
   * @default ngForage
   * @return {string}
   */
  get name(): string {
    return NgForageConfig.config.name;
  }

  /**
   * The name of the database. May appear during storage limit prompts. Useful to use the name of your app here.
   * In localStorage, this is used as a key prefix for all keys stored in localStorage.
   * @default ngForage
   * @param {string} v New name
   */
  set name(v: string) {
    NgForageConfig.config.name = v;
  }

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * @default 4980736
   * @return {number}
   */
  get size(): number {
    return NgForageConfig.config.size;
  }

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * @default 4980736
   * @param {number} v New size
   */
  set size(v: number) {
    NgForageConfig.config.size = v;
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
    return NgForageConfig.config.storeName;
  }

  /**
   * The name of the datastore.
   * In IndexedDB this is the dataStore,
   * in WebSQL this is the name of the key/value table in the database.
   * Must be alphanumeric, with underscores.
   * Any non-alphanumeric characters will be converted to underscores.
   * @default ng_forage
   * @param {string} v New name
   */
  set storeName(v: string) {
    NgForageConfig.config.storeName = v;
  }

  /**
   * The version of your database. May be used for upgrades in the future; currently unused.
   * @default 1.0
   * @return {number}
   */
  get version(): number {
    return NgForageConfig.config.version;
  }

  /**
   * The version of your database. May be used for upgrades in the future; currently unused.
   * @default 1.0
   * @param {number} v New version
   */
  set version(v: number) {
    NgForageConfig.config.version = v;
  }

  /**
   * A description of the database, essentially for developer usage.
   * @default
   * @return {string}
   */
  get description(): string {
    return NgForageConfig.config.description;
  }

  /**
   * A description of the database, essentially for developer usage.
   * @default
   * @param {string} v New description
   */
  set description(v: string) {
    NgForageConfig.config.description = v;
  }

  defineDriver(spec: LocalForageDriver): Promise<void> {
    return lf.defineDriver(spec);
  }

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