import {BaseConfigurable} from "./BaseConfigurable";

/**
 * A cacheable configurable object
 */
export declare interface FullyConfigurable extends BaseConfigurable {

  /**
   * Cache time in milliseconds
   * @default 300000
   */
  cacheTime: number;
}