import {CachedItem} from "./CachedItem";
import {LazyGetter} from "typescript-lazy-get-decorator";

/** @internal */
export class CachedItemImpl<T> implements CachedItem<T> {

  constructor(public readonly data: T,
              private readonly expiryTime: number) {

  }

  @LazyGetter()
  get hasData(): boolean {
    return this.data !== null;
  }

  @LazyGetter()
  get expires(): Date {
    if (typeof this.expiryTime === 'number') {
      return new Date(this.expiryTime);
    }

    return new Date(0);
  }

  @LazyGetter()
  get expiresIn(): number {
    return Math.max(0, this.expires.getTime() - Date.now());
  }

  @LazyGetter()
  get expired(): boolean {
    return this.expiresIn === 0;
  }
}