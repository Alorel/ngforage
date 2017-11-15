import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgForageModule} from '../NgForage/NgForage.module';
import {DemoComponent} from './DemoComponent/DemoComponent';
import {NgfKeyComponent} from './NgfKeyComponent/NgfKeyComponent';

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
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule
  ]
})
export class DemoModule {

}
