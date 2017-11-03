import {NgModule} from "@angular/core";
import {MyComponent} from "./MyComponent";

/**
 * Some fancy module
 */
@NgModule({
  declarations: [MyComponent],
  exports: [MyComponent]
})
export class MyModule {

}