import {Injectable} from '@angular/core';
import {Proto} from 'typescript-proto-decorator';
import {NgForageCache} from '../cache/ng-forage-cache.service';
import {NgForageConfig} from '../config/ng-forage-config.service';
import {NgForageOptions} from '../config/ng-forage-options';
import {InstanceFactory} from '../instance-factory/instance-factory.service';
import {NgForage} from '../main/ng-forage.service';
import {NC_NE_NW} from '../misc/std-descriptors';
import {NgForageCacheDedicated} from './ng-forage-cache-dedicated.class';
import {NgForageDedicated} from './ng-forage-dedicated.class';

/** @internal */
const conf$ = Symbol('NgForageConfig');
/** @internal */
const if$ = Symbol('InstanceFactory');

@Injectable({providedIn: 'root'})
export class DedicatedInstanceFactory {
  /** @internal */
  @Proto('DedicatedInstanceFactory', NC_NE_NW)
  public readonly [Symbol.toStringTag]: string;

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
