import type {CachedItem} from './cached-item';

/** @internal */
export class CachedItemImpl<T> implements CachedItem<T> {

  public readonly expires: Date;

  public readonly hasData: boolean;

  public constructor(public readonly data: T, expiryTime: number) {
    this.expires = new Date(typeof <any>expiryTime === 'number' ? expiryTime : 0);
    this.hasData = data != null;
  }

  public get expired(): boolean {
    return this.expiresIn === 0;
  }

  public get expiresIn(): number {
    return Math.max(0, this.expires.getTime() - Date.now());
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
