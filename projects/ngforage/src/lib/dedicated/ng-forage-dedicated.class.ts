import {NgForageOptions} from '../config/ng-forage-options';
import {NgForage} from '../main/ng-forage.service';

/** @internal */
export class NgForageDedicated extends NgForage {

  public clone(config?: NgForageOptions): NgForage {
    const inst = new NgForageDedicated(this.baseConfig, this.fact);
    inst.configure(Object.assign(this.finalConfig, config || {}));

    return inst;
  }
}

Object.defineProperty(NgForageDedicated.prototype, Symbol.toStringTag, {value: 'NgForage (dedicated)'});
