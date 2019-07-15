/** Cached data */
export interface CachedItem<T> {
  /** The data */
  readonly data: T;

  /** Whether the data has expired */
  readonly expired: boolean;

  /** When the cached item expired or will expire */
  readonly expires: Date;

  /** Number of milliseconds until the data expires */
  readonly expiresIn: number;

  /** Whether data was found */
  readonly hasData: boolean;
}
