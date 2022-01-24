import {Injectable} from '@angular/core';
import {NgForageCache} from '../cache';
import {NgForageConfig} from '../config';
import type {NgForageOptions} from '../config';
import {InstanceFactory} from '../instance-factory';
import {NgForage} from '../main';
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
