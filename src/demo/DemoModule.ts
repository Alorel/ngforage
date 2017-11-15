import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgForageModule} from '../NgForage/NgForage.module';
import {DemoComponent} from './DemoComponent';

@NgModule({
  bootstrap: [DemoComponent],
  declarations: [DemoComponent],
  entryComponents: [DemoComponent],
  imports: [
    BrowserModule,
    NgForageModule
  ]
})
export class DemoModule {

}
