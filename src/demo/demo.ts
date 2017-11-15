import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import './demo-common';
import {DemoModule} from './DemoModule';

// tslint:disable-next-line:no-unbound-method
platformBrowserDynamic().bootstrapModule(DemoModule).catch(console.error);
