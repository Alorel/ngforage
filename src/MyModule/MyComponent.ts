import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './MyComponent.pug',
  styleUrls: [
    './MyComponent.scss'
  ]
})
export class MyComponent {

}