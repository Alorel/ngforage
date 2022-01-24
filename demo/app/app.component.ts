import {ChangeDetectionStrategy, Component} from '@angular/core';

type Link = 'regular' | 'cache';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.border]': '"1px solid lightgrey"'
  },
  selector: 'ngf-demo',
  templateUrl: './app.component.html'
})
export class AppComponent {

  public activeTab: Link = 'regular';
}
