import {NgModule} from '@angular/core';
import {NgForageCache} from './NgForage/cache/NgForageCache.service';
import {_$factory as ngfcFactory, NgForageConfig} from './NgForage/config/NgForageConfig.service';
import {
  _$factory$ as instanceFactoryFactory,
  InstanceFactory
} from './NgForage/instance-factory/InstanceFactory.service';
import {NgForage} from './NgForage/main/NgForage.service';

/** @internal */
export const def: NgModule = {
  providers: [
    NgForage,
    NgForageCache,
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
