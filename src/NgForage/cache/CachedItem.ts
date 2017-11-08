/** Cached data */
export interface CachedItem<T> {
  /** The data */
  readonly data: T;

  /** Whether data was found */
  readonly hasData: boolean;

  /** Whether the data has expired */
  readonly expired: boolean;

  /** Number of milliseconds until the data expires */
  readonly expiresIn: number;

  /** When the cached item expired or will expire */
  readonly expires: Date;
}
