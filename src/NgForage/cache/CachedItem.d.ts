export declare interface CachedItem<T> {
  readonly data: T;
  readonly hasData: boolean;
  readonly expired: boolean;
  readonly expiresIn: number;
  readonly expires: Date;
}