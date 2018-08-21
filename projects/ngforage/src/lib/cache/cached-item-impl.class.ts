import {LazyGetter} from 'typescript-lazy-get-decorator';
import {Proto} from 'typescript-proto-decorator';
import {NC_NE_NW} from '../misc/std-descriptors';
import {CachedItem} from './cached-item';

/** @internal */
export class CachedItemImpl<T> implements CachedItem<T> {

  /** @internal */
  @Proto('CachedItem', NC_NE_NW)
  public readonly [Symbol.toStringTag];
  public readonly expires: Date;

  public constructor(public readonly data: T, expiryTime: number) {
    this.expires = new Date(typeof expiryTime === 'number' ? expiryTime : 0);
  }

  @LazyGetter()
  public get expired(): boolean {
    return this.expiresIn === 0;
  }

  @LazyGetter()
  public get expiresIn(): number {
    return Math.max(0, this.expires.getTime() - Date.now());
  }

  @LazyGetter()
  public get hasData(): boolean {
    return this.data !== null;
  }

  public toJSON(): CachedItem<T> {
    return {
      data: this.data,
      expired: this.expired,
      expires: this.expires,
      expiresIn: this.expiresIn,
      hasData: this.hasData
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJSON());
  }
}
