import {Inject, Injectable, Optional} from '@angular/core';
import 'localforage';
import {localForage as lf} from '../imports/localforage';
import type {DriverType} from '../misc/driver-type.type';
import {Driver} from '../misc/driver.enum';
import {DEFAULT_CONFIG} from '../misc/injection-tokens';
import type {BaseConfigurable} from './base-configurable';
import type {CacheConfigurable} from './cache-configurable';
import type {NgForageOptions} from './ng-forage-options';

/** @internal */
const $defaultConfig: unique symbol = Symbol('Default Config');

/**
 * Global/default configuration
 */
@Injectable({providedIn: 'root'})
export class NgForageConfig implements BaseConfigurable, CacheConfigurable {

  /** @internal */
  private readonly [$defaultConfig]: NgForageOptions;

  public constructor(@Optional() @Inject(DEFAULT_CONFIG) conf: NgForageOptions) {
    this[$defaultConfig] = {
      cacheTime: 300000,
      description: '',
      driver: [Driver.INDEXED_DB, Driver.WEB_SQL, Driver.LOCAL_STORAGE],
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
    return this[$defaultConfig].cacheTime!;
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
    return this[$defaultConfig].description!;
  }

  public set description(v: string) {
    this[$defaultConfig].description = v;
  }

  /**
   * The preferred driver(s) to use.
   */
  public get driver(): DriverType | DriverType[] {
    const d = this[$defaultConfig].driver;
    if (!d) {
      return [];
    } else if (Array.isArray(d)) {
      return d.slice();
    }

    return d;
  }

  public set driver(v: DriverType | DriverType[]) {
    this[$defaultConfig].driver = v;
  }

  /**
   * The name of the database. May appear during storage limit prompts. Useful to use the name of your app here.
   * In localStorage, this is used as a key prefix for all keys stored in localStorage.
   * @default ngForage
   */
  public get name(): string {
    return this[$defaultConfig].name!;
  }

  public set name(v: string) {
    this[$defaultConfig].name = v;
  }

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * @default 4980736
   */
  public get size(): number {
    return this[$defaultConfig].size!;
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
    return this[$defaultConfig].storeName!;
  }

  public set storeName(v: string) {
    this[$defaultConfig].storeName = v;
  }

  /**
   * The version of your database. May be used for upgrades in the future; currently unused.
   * @default 1.0
   */
  public get version(): number {
    return this[$defaultConfig].version!;
  }

  public set version(v: number) {
    this[$defaultConfig].version = v;
  }

  /**
   * Bulk-set configuration options
   * @param opts The configuration
   */
  public configure(opts: NgForageOptions): this {
    const resolved = {...opts};

    if (Array.isArray(resolved?.driver)) {
      resolved.driver = resolved.driver.slice();
    }

    Object.assign(this[$defaultConfig], resolved);

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
  public async defineDriver(spec: LocalForageDriver): Promise<void> {
    return await lf.defineDriver(spec);
  }

  /** @internal */
  public toJSON(): NgForageOptions {
    return this.config;
  }

  public toString(): string {
    return JSON.stringify(this.toJSON());
  }
}
