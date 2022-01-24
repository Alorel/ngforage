import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngf-github-ribbon',
  styleUrls: ['./github-ribbon.component.css'],
  templateUrl: './github-ribbon.component.html'
})
export class GithubRibbonComponent implements AfterViewInit {

  public constructor(private readonly cdr: ChangeDetectorRef) {
  }

  /** @inheritDoc */
  public ngAfterViewInit(): void {
    this.cdr.detach();
  }
}
