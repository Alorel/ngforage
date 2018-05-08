import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgForageConfig} from './config/NgForageConfig.service';
import {InstanceFactory} from './instance-factory/InstanceFactory.service';

/**
 * NgForage core module
 */
@NgModule({})
export class NgForageModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgForageModule,
      providers: [
        NgForageConfig.provider,
        InstanceFactory.provider
      ]
    };
  }
}
