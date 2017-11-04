import {Inject, Injectable} from "@angular/core";
import {InstanceFactory} from "../instance-factory/InstanceFactory.service";
import {NgForageOptions} from "./NgForageOptions";
import 'localforage';
import {NgForageConfig} from "./NgForageConfig.service";
import {BaseConfigurable} from "./BaseConfigurable";

/** @internal */
@Injectable()
export abstract class BaseConfigurableImpl implements BaseConfigurable {

  /** @internal */
  protected readonly baseConfig: NgForageConfig;

  /** @internal */
  protected readonly config: NgForageOptions = {};

  /** @internal */
  private readonly fact: InstanceFactory;

  /** @internal */
  private _store: LocalForage;

  /** @internal */
  protected storeNeedsRecalc: boolean = true;

  constructor(@Inject(NgForageConfig) config: NgForageConfig,
              @Inject(InstanceFactory) instanceFactory: InstanceFactory) {
    this.baseConfig = config;
    this.fact = instanceFactory;
  }

  /** @internal */
  private get finalConfig(): NgForageOptions {
    return Object.assign(
      {},
      this.baseConfig.config,
      this.config
    );
  }

  /** @internal */
  protected get store(): LocalForage {
    if (this.storeNeedsRecalc || !this._store) {
      this._store = this.fact.getInstance(this.finalConfig);
      this.storeNeedsRecalc = false;
    }

    return this._store;
  }

  /** @inheritDoc */
  configure(opts: NgForageOptions): this {
    Object.assign(this.config, opts || {});
    this.storeNeedsRecalc = true;
    return this;
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
    return 'driver' in this.config ? this.config.driver : this.baseConfig.driver;
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
    this.config.driver = v;
    this.storeNeedsRecalc = true;
  }

  /**
   * The name of the database. May appear during storage limit prompts. Useful to use the name of your app here.
   * In localStorage, this is used as a key prefix for all keys stored in localStorage.
   * @default ngForage
   * @return {string}
   */
  get name(): string {
    return 'name' in this.config ? this.config.name : this.baseConfig.name;
  }

  /**
   * The name of the database. May appear during storage limit prompts. Useful to use the name of your app here.
   * In localStorage, this is used as a key prefix for all keys stored in localStorage.
   * @default ngForage
   * @param {string} v New name
   */
  set name(v: string) {
    this.config.name = v;
    this.storeNeedsRecalc = true;
  }

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * @default 4980736
   * @return {number}
   */
  get size(): number {
    return 'size' in this.config ? this.config.size : this.baseConfig.size;
  }

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * @default 4980736
   * @param {number} v New size
   */
  set size(v: number) {
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
   * @return {string}
   */
  get storeName(): string {
    return 'storeName' in this.config ? this.config.storeName : this.baseConfig.storeName;
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
    this.config.storeName = v;
    this.storeNeedsRecalc = true;
  }

  /**
   * The version of your database. May be used for upgrades in the future; currently unused.
   * @default 1.0
   * @return {number}
   */
  get version(): number {
    return 'version' in this.config ? this.config.version : this.baseConfig.version;
  }

  /**
   * The version of your database. May be used for upgrades in the future; currently unused.
   * @default 1.0
   * @param {number} v New version
   */
  set version(v: number) {
    this.config.version = v;
    this.storeNeedsRecalc = true;
  }

  /**
   * A description of the database, essentially for developer usage.
   * @default
   * @return {string}
   */
  get description(): string {
    return 'description' in this.config ? this.config.description : this.baseConfig.description;
  }

  /**
   * A description of the database, essentially for developer usage.
   * @default
   * @param {string} v New description
   */
  set description(v: string) {
    this.config.description = v;
    this.storeNeedsRecalc = true;
  }
}