import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgForageCache} from './cache/NgForageCache.service';
import {NgForageConfig} from './config/NgForageConfig.service';
import {InstanceFactory} from './instance-factory/InstanceFactory.service';
import {NgForage} from './main/NgForage.service';

/**
 * NgForage core module
 */
@NgModule({})
export class NgForageModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgForageModule,
      providers: [
        NgForage,
        NgForageCache,
        NgForageConfig.provider,
        InstanceFactory.provider
      ]
    };
  }
}
