import {NgForageCache} from '../cache';
import type {NgForageOptions} from '../config';

/** @internal */
export class NgForageCacheDedicated extends NgForageCache {

  /** @inheritDoc */
  public override clone(config?: NgForageOptions): NgForageCache {
    const inst = new NgForageCacheDedicated(this.baseConfig, this.fact);
    inst.configure({...this.finalConfig, ...config});

    return inst;
  }
}
