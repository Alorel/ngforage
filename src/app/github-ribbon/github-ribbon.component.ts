import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngf-github-ribbon',
  styleUrls: ['./github-ribbon.component.css'],
  templateUrl: './github-ribbon.component.html'
})
export class GithubRibbonComponent {

  public constructor(@Inject(ChangeDetectorRef) cdr: ChangeDetectorRef) {
    cdr.detach();
  }
}
