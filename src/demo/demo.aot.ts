import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
import {DemoModuleNgFactory} from '../../.tmp/aot/.tmp/pre-aot/demo/DemoModule.ngfactory';
import './demo-common';

enableProdMode();
// tslint:disable-next-line:no-unbound-method
platformBrowser().bootstrapModuleFactory(DemoModuleNgFactory).catch(console.error);
