import {Injectable} from '@angular/core';
import {NgForageCache} from '../cache/ng-forage-cache.service';
import {NgForageConfig} from '../config/ng-forage-config.service';
import {NgForageOptions} from '../config/ng-forage-options';
import {InstanceFactory} from '../instance-factory/instance-factory.service';
import {NgForage} from '../main/ng-forage.service';
import {NgForageCacheDedicated} from './ng-forage-cache-dedicated.class';
import {NgForageDedicated} from './ng-forage-dedicated.class';

/** @internal */
const conf$: unique symbol = Symbol('NgForageConfig');
/** @internal */
const if$: unique symbol = Symbol('InstanceFactory');

@Injectable({providedIn: 'root'})
export class DedicatedInstanceFactory {

  /** @internal */
  private readonly [conf$]: NgForageConfig;

  /** @internal */
  private readonly [if$]: InstanceFactory;

  public constructor(conf: NgForageConfig, instFact: InstanceFactory) {
    this[conf$] = conf;
    this[if$] = instFact;
  }

  public createCache(config?: NgForageOptions): NgForageCache {
    const inst = new NgForageCacheDedicated(this[conf$], this[if$]);
    if (config) {
      inst.configure(config);
    }

    return inst;
  }

  public createNgForage(config?: NgForageOptions): NgForage {
    const inst = new NgForageDedicated(this[conf$], this[if$]);
    if (config) {
      inst.configure(config);
    }

    return inst;
  }
}
