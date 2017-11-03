import './demo-common';
import {platformBrowser} from "@angular/platform-browser";
import {DemoModuleNgFactory} from '../../.tmp/aot/.tmp/pre-aot/demo/DemoModule.ngfactory';
import {enableProdMode} from "@angular/core";

enableProdMode();
platformBrowser().bootstrapModuleFactory(DemoModuleNgFactory);