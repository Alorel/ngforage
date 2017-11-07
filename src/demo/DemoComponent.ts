import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {NgForage} from "../NgForage/main/NgForage.service";
import {NgForageCache} from "../NgForage/cache/NgForageCache.service";

@Component({
  selector: 'my-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<span>Demo coming soon</span><ul><li>{{store}}</li><li>{{cache}}</li></ul>',
  providers: [NgForage, NgForageCache]
})
export class DemoComponent implements OnInit {

  public store: string;
  public cache: string;

  constructor(private readonly ngf: NgForage, private readonly ngfc: NgForageCache) {

  }

  ngOnInit(): void {
    this.store = this.ngf.toString();
    this.cache = this.ngfc.toString();
  }
}