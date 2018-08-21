import {NgModule} from '@angular/core';
import {NgForageCache} from './lib/cache/ng-forage-cache.service';
import {NgForageConfig} from './lib/config/ng-forage-config.service';
import {DedicatedInstanceFactory} from './lib/dedicated/dedicated-instance-factory.service';
import {InstanceFactory} from './lib/instance-factory/instance-factory.service';
import {NgForage} from './lib/main/ng-forage.service';

/** @internal */
export const def: NgModule = {
  providers: [
    NgForage,
    NgForageCache,
    DedicatedInstanceFactory,
    NgForageConfig,
    InstanceFactory
  ]
};
