import {NgModule} from '@angular/core';
import {NgForage} from './NgForage';
import {NgForageCache} from './NgForage/cache/NgForageCache.service';
import {NgForageConfig} from './NgForage/config/NgForageConfig.service';
import {InstanceFactory} from './NgForage/instance-factory/InstanceFactory.service';

/** @internal */
export const def: NgModule = {
  providers: [
    NgForage,
    NgForageCache,
    NgForageConfig.provider,
    InstanceFactory.provider
  ]
};
