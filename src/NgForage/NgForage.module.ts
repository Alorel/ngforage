import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgForageCache} from './cache/NgForageCache.service';
import {_$factory as ngfcFactory, NgForageConfig} from './config/NgForageConfig.service';
import {DedicatedInstanceFactory} from './dedicated/DedicatedInstanceFactory';
import {_$factory$ as instanceFactoryFactory, InstanceFactory} from './instance-factory/InstanceFactory.service';
import {NgForage} from './main/NgForage.service';

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
        NgForage,
        NgForageCache,
        DedicatedInstanceFactory,
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
