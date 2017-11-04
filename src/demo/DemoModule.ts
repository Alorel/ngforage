import {DemoComponent} from "./DemoComponent";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {NgForageModule} from "../NgForage/NgForage.module";

@NgModule({
  imports: [
    BrowserModule,
    NgForageModule
  ],
  declarations: [DemoComponent],
  entryComponents: [DemoComponent],
  bootstrap: [DemoComponent]
})
export class DemoModule {

}