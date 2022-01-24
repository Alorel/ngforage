import {Inject, Injectable} from '@angular/core';
import 'localforage';
import {InstanceFactory} from '../instance-factory';
import type {DriverType} from '../misc/driver-type.type';
import type {BaseConfigurable} from './base-configurable';
import {NgForageConfig} from './ng-forage-config.service';
import type {NgForageOptions} from './ng-forage-options';

/** @internal */
const store$: unique symbol = Symbol('Store');

/**
 * Abstract service-level configuration layer for NgForage
 */
@Injectable()
export abstract class BaseConfigurableImpl implements BaseConfigurable {

  /** @internal */
  protected readonly baseConfig: NgForageConfig;

  /** @internal */
  protected readonly config: NgForageOptions = {};

  /** @internal */
  protected readonly fact: InstanceFactory;

  /** @internal */
  protected storeNeedsRecalc = true;

  /** @internal */
  private [store$]: LocalForage;

  /** @internal */
  public constructor(
    @Inject(NgForageConfig) config: NgForageConfig,
    @Inject(InstanceFactory) instanceFactory: InstanceFactory
  ) {
    this.baseConfig = config;
    this.fact = instanceFactory;
  }

  /**
   * A description of the database, essentially for developer usage.
   * @default ""
   */
  public get description(): string {
    return this.config.description || this.baseConfig.description;
  }

  public set description(v: string) {
    this.config.description = v;
    this.storeNeedsRecalc = true;
  }

  /**
   * The preferred driver(s) to use.
   * @default IndexedDB, WebSQL and localStorage
   */
  public get driver(): DriverType | DriverType[] {
    return this.config.driver ?? this.baseConfig.driver;
  }

  public set driver(v: DriverType | DriverType[]) {
    this.config.driver = v;
    this.storeNeedsRecalc = true;
  }

  /**
   * The name of the database. May appear during storage limit prompts. Useful to use the name of your app here.
   * In localStorage, this is used as a key prefix for all keys stored in localStorage.
   * @default ngForage
   */
  public get name(): string {
    return this.config.name || this.baseConfig.name;
  }

  public set name(v: string) {
    this.config.name = v;
    this.storeNeedsRecalc = true;
  }

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * @default 4980736
   */
  public get size(): number {
    return this.config.size ?? this.baseConfig.size;
  }

  public set size(v: number) {
    this.config.size = v;
    this.storeNeedsRecalc = true;
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
    return this.config.storeName ?? this.baseConfig.storeName;
  }

  public set storeName(v: string) {
    this.config.storeName = v;
    this.storeNeedsRecalc = true;
  }

  /**
   * The version of your database. May be used for upgrades in the future; currently unused.
   * @default 1.0
   */
  public get version(): number {
    return this.config?.version ?? this.baseConfig.version;
  }

  public set version(v: number) {
    this.config.version = v;
    this.storeNeedsRecalc = true;
  }

  /** @internal */
  protected get finalConfig(): NgForageOptions {
    return {
      ...this.baseConfig.config,
      ...this.config,
    };
  }

  /** @internal */
  protected get store(): LocalForage {
    if (this.storeNeedsRecalc || !this[store$]) {
      this[store$] = this.fact.getInstance(this.finalConfig);
      this.storeNeedsRecalc = false;
    }

    return this[store$];
  }

  /**
   * Bulk-set configuration options
   * @param opts The configuration
   */
  public configure(opts: NgForageOptions): this {
    opts = opts || {};

    if (Array.isArray(opts.driver)) {
      opts.driver = opts.driver.slice();
    }

    Object.assign(this.config, opts);
    this.storeNeedsRecalc = true;

    return this;
  }

  public toJSON(): Partial<NgForageOptions> {
    return {
      description: this.description,
      driver: this.driver,
      name: this.name,
      size: this.size,
      storeName: this.storeName,
      version: this.version
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJSON());
  }
}
