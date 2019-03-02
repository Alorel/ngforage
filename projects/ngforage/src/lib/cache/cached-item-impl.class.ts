import {setToStringTag} from '../misc/setToStringTag.function';
import {CachedItem} from './cached-item';

/** @internal */
export class CachedItemImpl<T> implements CachedItem<T> {

  public readonly expires: Date;

  public constructor(public readonly data: T, expiryTime: number) {
    this.expires = new Date(typeof <any>expiryTime === 'number' ? expiryTime : 0);
  }

  public get expired(): boolean {
    const value = this.expiresIn === 0;
    if (value) {
      Object.defineProperty(this, 'expired', {value});
    }

    return value;
  }

  public get expiresIn(): number {
    const value = Math.max(0, this.expires.getTime() - Date.now());
    if (!value) {
      Object.defineProperty(this, 'expiresIn', {value});
    }

    return value;
  }

  public get hasData(): boolean {
    const value = this.data != null; //tslint:disable-line:triple-equals
    Object.defineProperty(this, 'hasData', {value});

    return value;
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

setToStringTag(CachedItemImpl, 'CachedItem');
