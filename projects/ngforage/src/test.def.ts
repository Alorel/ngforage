import {NgModule} from '@angular/core';
import {NgForageCache} from './lib/cache/NgForageCache.service';
import {NgForageConfig} from './lib/config/NgForageConfig.service';
import {DedicatedInstanceFactory} from './lib/dedicated/DedicatedInstanceFactory';
import {InstanceFactory} from './lib/instance-factory/InstanceFactory.service';
import {NgForage} from './lib/main/NgForage.service';

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
