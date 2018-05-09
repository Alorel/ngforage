import {Injectable} from '@angular/core';
import {NgForageCache} from '../cache/NgForageCache.service';
import {NgForageConfig} from '../config/NgForageConfig.service';
import {NgForageOptions} from '../config/NgForageOptions';
import {InstanceFactory} from '../instance-factory/InstanceFactory.service';
import {NgForage} from '../main/NgForage.service';
import {NgForageCacheDedicated} from './NgForageCacheDedicated';
import {NgForageDedicated} from './NgForageDedicated';

/** @internal */
const conf$ = Symbol('NgForageConfig');
/** @internal */
const if$ = Symbol('InstanceFactory');

@Injectable()
export class DedicatedInstanceFactory {
  public constructor(conf: NgForageConfig, instFact: InstanceFactory) {
    this[conf$] = conf;
    this[if$] = instFact;
  }

  public createCache(config?: NgForageOptions): NgForageCache {
    const inst = new NgForageCacheDedicated(<NgForageConfig>this[conf$], <InstanceFactory>this[if$]);
    if (config) {
      inst.configure(config);
    }

    return inst;
  }

  public createNgForage(config?: NgForageOptions): NgForage {
    const inst = new NgForageDedicated(<NgForageConfig>this[conf$], <InstanceFactory>this[if$]);
    if (config) {
      inst.configure(config);
    }

    return inst;
  }
}
