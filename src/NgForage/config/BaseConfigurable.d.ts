import {NgForageOptions} from "./NgForageOptions";

/**
 * A configurable object
 */
export declare interface BaseConfigurable {
  /**
   * Bulk-set configuration options
   * @param {NgForageOptions} opts The configuration
   * @return {this}
   */
  configure(opts: NgForageOptions): this;

  /**
   * The preferred driver(s) to use.
   * @see {@link NgForageConfig#DRIVER_INDEXEDDB}
   * @see {@link NgForageConfig#DRIVER_WEBSQL}
   * @see {@link NgForageConfig#DRIVER_LOCALSTORAGE}
   * @default [{@link NgForageConfig#DRIVER_INDEXEDDB IndexedDB}, {@link NgForageConfig#DRIVER_INDEXEDDB WebSQL}, {@link NgForageConfig#DRIVER_LOCALSTORAGE localStorage}]
   */
  driver: string | string[];

  /**
   * The name of the database. May appear during storage limit prompts. Useful to use the name of your app here.
   * In localStorage, this is used as a key prefix for all keys stored in localStorage.
   * @default ngForage
   */
  name: string;

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * @default 4980736
   */
  size: number;

  /**
   * The name of the datastore.
   * In IndexedDB this is the dataStore,
   * in WebSQL this is the name of the key/value table in the database.
   * Must be alphanumeric, with underscores.
   * Any non-alphanumeric characters will be converted to underscores.
   * @default ng_forage
   */
  storeName: string;

  /**
   * The version of your database. May be used for upgrades in the future; currently unused.
   * @default 1.0
   */
  version: number;

  /**
   * A description of the database, essentially for developer usage.
   * @default
   */
  description: string;
}