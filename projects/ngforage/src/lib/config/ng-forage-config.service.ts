import {Inject, Injectable, Optional} from '@angular/core';
import 'localforage';
import {DEFAULT_CONFIG} from '../DEFAULT_CONFIG.token';
import {localForage as lf} from '../imports/localforage';
import {_driver} from '../session-storage';
import {BaseConfigurable} from './base-configurable';
import {CacheConfigurable} from './cache-configurable';
import {NgForageOptions} from './ng-forage-options';

const $defaultConfig = Symbol('Default Config');

/**
 * Global/default configuration
 */
@Injectable({providedIn: 'root'})
export class NgForageConfig implements BaseConfigurable, CacheConfigurable {

  /** The IndexedDB driver */
  public static readonly DRIVER_INDEXEDDB: string = lf.INDEXEDDB;
  /** The localStorage driver */
  public static readonly DRIVER_LOCALSTORAGE: string = lf.LOCALSTORAGE;
  /** The sessionStorage driver */
  public static readonly DRIVER_SESSIONSTORAGE: string = _driver;
  /** The WebSQL driver */
  public static readonly DRIVER_WEBSQL: string = lf.WEBSQL;

  public constructor(@Optional() @Inject(DEFAULT_CONFIG) conf: NgForageOptions) {
    this[$defaultConfig] = {
      cacheTime: 300000,
      description: '',
      driver: [lf.INDEXEDDB, lf.WEBSQL, lf.LOCALSTORAGE],
      name: 'ngForage',
      size: 4980736,
      storeName: 'ng_forage',
      version: 1
    };
    if (conf) {
      this.configure(conf);
    }
  }

  /**
   * Cache time in milliseconds
   * @default 300000
   */
  public get cacheTime(): number {
    return this[$defaultConfig].cacheTime;
  }

  public set cacheTime(t: number) {
    this[$defaultConfig].cacheTime = t;
  }

  /**
   * Get the compiled configuration
   */
  public get config(): NgForageOptions {
    return {
      cacheTime: this.cacheTime,
      description: this.description,
      driver: this.driver,
      name: this.name,
      size: this.size,
      storeName: this.storeName,
      version: this.version
    };
  }

  /**
   * A description of the database, essentially for developer usage.
   * @default
   */
  public get description(): string {
    return this[$defaultConfig].description;
  }

  public set description(v: string) {
    this[$defaultConfig].description = v;
  }

  /**
   * The preferred driver(s) to use.
   * @see {@link NgForageConfig#DRIVER_INDEXEDDB}
   * @see {@link NgForageConfig#DRIVER_WEBSQL}
   * @see {@link NgForageConfig#DRIVER_LOCALSTORAGE}
   * @see {@link NgForageConfig#DRIVER_SESSIONSTORAGE}
   */
  public get driver(): string | string[] {
    if (typeof this[$defaultConfig].driver === 'string') {
      return this[$defaultConfig].driver;
    }

    return this[$defaultConfig].driver.slice();
  }

  public set driver(v: string | string[]) {
    this[$defaultConfig].driver = v;
  }

  /**
   * The name of the database. May appear during storage limit prompts. Useful to use the name of your app here.
   * In localStorage, this is used as a key prefix for all keys stored in localStorage.
   * @default ngForage
   */
  public get name(): string {
    return this[$defaultConfig].name;
  }

  public set name(v: string) {
    this[$defaultConfig].name = v;
  }

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * @default 4980736
   */
  public get size(): number {
    return this[$defaultConfig].size;
  }

  public set size(v: number) {
    this[$defaultConfig].size = v;
  }

  /**
   * The name of the datastore.
   * In IndexedDB this is the dataStore,
   * in WebSQL this is the name of the key/value table in the database.
   * Must be alphanumeric, with underscores.
   * Any non-alphanumeric characters will be converted to underscores.
   * @default ng_forage
   */
  public get storeName(): string {
    return this[$defaultConfig].storeName;
  }

  public set storeName(v: string) {
    this[$defaultConfig].storeName = v;
  }

  /**
   * The version of your database. May be used for upgrades in the future; currently unused.
   * @default 1.0
   */
  public get version(): number {
    return this[$defaultConfig].version;
  }

  public set version(v: number) {
    this[$defaultConfig].version = v;
  }

  /**
   * Bulk-set configuration options
   * @param opts The configuration
   */
  public configure(opts: NgForageOptions): this {
    opts = opts || {};

    if ('driver' in opts && opts.driver.slice) {
      opts.driver = opts.driver.slice();
    }

    Object.assign(this[$defaultConfig], opts);

    return this;
  }

  /**
   * Define a driver
   *
   * You’ll want to make sure you accept a callback argument and that you pass the same arguments to callbacks as the
   * default drivers do. You’ll also want to resolve or reject promises.
   * Check any of the {@link https://github.com/mozilla/localForage/tree/master/src/drivers default drivers}
   * for an idea of how to implement your own, custom driver.
   * @param spec Driver spec
   */
  public defineDriver(spec: LocalForageDriver): Promise<void> {
    return lf.defineDriver(spec);
  }

  /** @internal */
  public toJSON(): NgForageOptions {
    return this.config;
  }

  public toString(): string {
    return JSON.stringify(this.toJSON());
  }
}

Object.defineProperty(NgForageConfig.prototype, Symbol.toStringTag, {value: 'NgForageConfig'});
