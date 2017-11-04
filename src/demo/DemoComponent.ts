import {ChangeDetectionStrategy, Component} from "@angular/core";
import {NgForage} from "../NgForage/main/NgForage.service";

@Component({
  selector: 'my-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'hai'
})
export class DemoComponent {

  constructor(ngf: NgForage) {
    console.dir(ngf);
  }
}