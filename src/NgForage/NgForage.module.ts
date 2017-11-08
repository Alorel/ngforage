import {NgModule} from '@angular/core';
import {NgForageCache} from './cache/NgForageCache.service';
import {BaseConfigurableImpl} from './config/BaseConfigurableImpl.service';
import {NgForageConfig} from './config/NgForageConfig.service';
import {InstanceFactory} from './instance-factory/InstanceFactory.service';
import {NgForage} from './main/NgForage.service';

/** @internal */
export const def: NgModule = {
  providers: [
    NgForage,
    NgForageCache,
    <any>BaseConfigurableImpl,
    NgForageConfig.provider,
    InstanceFactory.provider
  ]
};

@NgModule(def)
export class NgForageModule {

}
