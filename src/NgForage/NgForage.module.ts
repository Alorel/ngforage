import {ModuleWithProviders, NgModule} from '@angular/core';
import {_$factory as ngfcFactory, NgForageConfig} from './config/NgForageConfig.service';
import {_$factory$ as instanceFactoryFactory, InstanceFactory} from './instance-factory/InstanceFactory.service';

/**
 * NgForage core module
 */
@NgModule({})
export class NgForageModule {

  // istanbul ignore next
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgForageModule,
      providers: [
        {
          deps: [],
          provide: NgForageConfig,
          useFactory: ngfcFactory
        },
        {
          deps: [NgForageConfig],
          provide: InstanceFactory,
          useFactory: instanceFactoryFactory
        }
      ]
    };
  }
}
