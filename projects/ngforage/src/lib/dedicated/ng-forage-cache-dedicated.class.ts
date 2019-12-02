import {NgForageCache} from '../cache/ng-forage-cache.service';
import {NgForageOptions} from '../config/ng-forage-options';

/** @internal */
export class NgForageCacheDedicated extends NgForageCache {

  public clone(config?: NgForageOptions): NgForageCache {
    const inst = new NgForageCacheDedicated(this.baseConfig, this.fact);
    inst.configure(Object.assign(this.finalConfig, config || {}));

    return inst;
  }
}
