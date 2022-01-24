import {NgForageOptions} from '../config/ng-forage-options';
import {NgForage} from '../main/ng-forage.service';

/** @internal */
export class NgForageDedicated extends NgForage {

  /** @inheritDoc */
  public override clone(config?: NgForageOptions): NgForage {
    const inst = new NgForageDedicated(this.baseConfig, this.fact);
    inst.configure({...this.finalConfig, ...config});

    return inst;
  }
}
