import {NgModule, Provider} from '@angular/core';
import {NgForageCache} from './cache/NgForageCache.service';
import {BaseConfigurableImpl} from './config/BaseConfigurableImpl.service';
import {NgForageConfig} from './config/NgForageConfig.service';
import {InstanceFactory} from './instance-factory/InstanceFactory.service';
import {NgForage} from './main/NgForage.service';

/**
 * NgForage core module
 */
@NgModule({
  providers: [
    NgForage,
    NgForageCache,
    <Provider>BaseConfigurableImpl,
    NgForageConfig.provider,
    InstanceFactory.provider
  ]
})
export class NgForageModule {

}
