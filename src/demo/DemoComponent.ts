import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NgForageCache} from '../NgForage/cache/NgForageCache.service';
import {NgForage} from '../NgForage/main/NgForage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgForage, NgForageCache],
  selector: 'my-demo',
  styleUrls: ['./demo.scss'],
  templateUrl: './DemoComponent.pug'
})
export class DemoComponent implements OnInit {

  public store: string;
  public cache: string;

  public constructor(private readonly ngf: NgForage, private readonly ngfc: NgForageCache) {

  }

  public ngOnInit(): void {
    this.store = this.ngf.toString();
    this.cache = this.ngfc.toString();
  }
}
