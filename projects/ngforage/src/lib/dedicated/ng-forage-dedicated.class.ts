import {Proto} from 'typescript-proto-decorator';
import {NgForageOptions} from '../config/ng-forage-options';
import {NgForage} from '../main/ng-forage.service';
import {NC_NE_NW} from '../misc/std-descriptors';

/** @internal */
export class NgForageDedicated extends NgForage {
  /** @internal */
  @Proto('NgForage (dedicated)', NC_NE_NW)
  public readonly [Symbol.toStringTag]: string;

  public clone(config?: NgForageOptions): NgForage {
    const inst = new NgForageDedicated(this.baseConfig, this.fact);
    inst.configure(Object.assign(this.finalConfig, config || {}));

    return inst;
  }
}
