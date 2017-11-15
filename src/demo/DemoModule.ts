import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatInputModule, MatListModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgForageModule} from '../NgForage/NgForage.module';
import {DemoComponent} from './DemoComponent';
import {NgfKeyComponent} from './NgfKeyComponent';

@NgModule({
  bootstrap: [DemoComponent],
  declarations: [DemoComponent, NgfKeyComponent],
  entryComponents: [DemoComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgForageModule,
    MatButtonModule,
    MatInputModule,
    MatListModule
  ]
})
export class DemoModule {

}
