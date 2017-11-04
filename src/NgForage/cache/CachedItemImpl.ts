import {CachedItem} from "./CachedItem";
import {LazyGetter} from "typescript-lazy-get-decorator";
import {addToStringTag} from "../util/addToStringTag";

/** @internal */
export class CachedItemImpl<T> implements CachedItem<T> {

  readonly expires: Date;

  constructor(public readonly data: T,
              expiryTime: number) {

    if (typeof expiryTime === 'number') {
      this.expires = new Date(expiryTime);
    } else {
      this.expires = new Date(0);
    }
  }

  @LazyGetter()
  get hasData(): boolean {
    return this.data !== null;
  }

  @LazyGetter()
  get expiresIn(): number {
    return Math.max(0, this.expires.getTime() - Date.now());
  }

  @LazyGetter()
  get expired(): boolean {
    return this.expiresIn === 0;
  }

  toJSON(): CachedItem<T> {
    return {
      data: this.data,
      hasData: this.hasData,
      expired: this.expired,
      expiresIn: this.expiresIn,
      expires: this.expires
    };
  }
}

addToStringTag(CachedItemImpl, 'CachedItem');