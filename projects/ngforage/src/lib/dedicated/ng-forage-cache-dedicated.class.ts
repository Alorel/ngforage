import {Proto} from 'typescript-proto-decorator';
import {NgForageCache} from '../cache/ng-forage-cache.service';
import {NgForageOptions} from '../config/ng-forage-options';
import {NC_NE_NW} from '../misc/std-descriptors';

/** @internal */
export class NgForageCacheDedicated extends NgForageCache {
  /** @internal */
  @Proto('NgForageCache (dedicated)', NC_NE_NW)
  public readonly [Symbol.toStringTag]: string;

  public clone(config?: NgForageOptions): NgForageCache {
    const inst = new NgForageCacheDedicated(this.baseConfig, this.fact);
    inst.configure(Object.assign(this.finalConfig, config || {}));

    return inst;
  }
}
