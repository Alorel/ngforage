import {DemoComponent} from "./DemoComponent";
import {MyModule} from "../MyModule/MyModule";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

@NgModule({
  imports: [
    BrowserModule,
    MyModule
  ],
  declarations: [DemoComponent],
  entryComponents: [DemoComponent],
  bootstrap: [DemoComponent]
})
export class DemoModule {

}