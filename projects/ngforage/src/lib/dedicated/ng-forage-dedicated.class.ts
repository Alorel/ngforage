import {NgForageOptions} from '../config/ng-forage-options';
import {NgForage} from '../main/ng-forage.service';
import {setToStringTag} from '../misc/setToStringTag.function';

/** @internal */
export class NgForageDedicated extends NgForage {

  public clone(config?: NgForageOptions): NgForage {
    const inst = new NgForageDedicated(this.baseConfig, this.fact);
    inst.configure(Object.assign(this.finalConfig, config || {}));

    return inst;
  }
}

setToStringTag(NgForageDedicated, 'NgForage (dedicated)');
