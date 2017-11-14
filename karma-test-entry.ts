//tslint:disable
import 'core-js';
import 'rxjs/Rx';
import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/jasmine-patch';
import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NgModule} from "@angular/core";
import {NgForage} from "./src/NgForage/main/NgForage.service";
import {NgForageCache} from "./src/NgForage/cache/NgForageCache.service";
import {BaseConfigurableImpl} from "./src/NgForage/config/BaseConfigurableImpl.service";
import {NgForageConfig} from "./src/NgForage/config/NgForageConfig.service";
import {InstanceFactory} from "./src/NgForage/instance-factory/InstanceFactory.service";

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
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

const testsContext: any = require.context('./src', true, /\.spec/);
testsContext.keys().forEach(testsContext);
