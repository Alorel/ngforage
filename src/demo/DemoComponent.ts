import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'my-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<my-component></my-component>'
})
export class DemoComponent {

}