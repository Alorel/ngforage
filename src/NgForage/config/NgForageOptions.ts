import 'localforage';

/**
 * NgForage configuration
 */
export type NgForageOptions = LocalForageOptions & {
  /**
   * Cache time in milliseconds
   * @default 300000
   */
  cacheTime?: number
};