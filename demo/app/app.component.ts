import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GithubRibbonComponent} from './github-ribbon/github-ribbon.component';
import {StorageTabComponent} from './storage-tab/storage-tab.component';

type Link = 'regular' | 'cache';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.border]': '"1px solid lightgrey"'
  },
  imports: [
    CommonModule,

    StorageTabComponent,
    GithubRibbonComponent,
  ],
  selector: 'ngf-demo',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {

  public activeTab: Link = 'regular';
}
