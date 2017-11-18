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
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgForageModule} from '../NgForage/NgForage.module';
import {DemoComponent} from './DemoComponent/DemoComponent';
import {ImgLink} from './ImgLink/ImgLink';
import {GitHubIcon} from './NgfIcon/GitHubIcon';
import {NgfIcon} from './NgfIcon/NgfIcon';
import {NgfKeyComponent} from './NgfKeyComponent/NgfKeyComponent';
import {ServiceWorkerRegistrator} from './ServiceWorkerRegistrator';

@NgModule({
            bootstrap:       [DemoComponent],
            declarations:    [
              ImgLink,
              GitHubIcon,
              DemoComponent,
              NgfKeyComponent,
              NgfIcon
            ],
            entryComponents: [DemoComponent],
            imports:         [
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
              MatMenuModule,
              MatSnackBarModule
            ],
            providers:       [ServiceWorkerRegistrator]
          })
export class DemoModule {

}
