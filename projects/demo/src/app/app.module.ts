import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NgForageModule} from 'ngforage/src/lib';
import {AppComponent} from './app.component';
import {AsStringPipe} from './asString.pipe';
import {ButtonStylingDirective} from './button-styling.directive';
import {EngineSelectComponent} from './engine-select/engine-select.component';
import {FullConfigComponent} from './full-config/full-config.component';
import {GithubRibbonComponent} from './github-ribbon/github-ribbon.component';
import {OptionsSelectComponent} from './options-select/options-select.component';
import {OutputComponent} from './output/output.component';
import {StorageTabComponent} from './storage-tab/storage-tab.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    EngineSelectComponent,
    StorageTabComponent,
    OptionsSelectComponent,
    FullConfigComponent,
    AsStringPipe,
    OutputComponent,
    ButtonStylingDirective,
    GithubRibbonComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    NgForageModule.forRoot()
  ]
})
export class AppModule {
}
