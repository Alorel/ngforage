import {NgModule} from '@angular/core';
import {NgForage} from './NgForage';
import {NgForageCache} from './NgForage/cache/NgForageCache.service';
import {_$factory as ngfcFactory, NgForageConfig} from './NgForage/config/NgForageConfig.service';
import {DedicatedInstanceFactory} from './NgForage/dedicated/DedicatedInstanceFactory';
import {
  _$factory$ as instanceFactoryFactory,
  InstanceFactory
} from './NgForage/instance-factory/InstanceFactory.service';

/** @internal */
export const def: NgModule = {
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
