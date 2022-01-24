import {NgModule} from '@angular/core';
import {NgForageCache} from './lib';
import {NgForageConfig} from './lib';
import {DedicatedInstanceFactory} from './lib';
import {InstanceFactory} from './lib';
import {NgForage} from './lib';

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
