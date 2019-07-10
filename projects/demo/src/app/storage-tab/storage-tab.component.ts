import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {LazyGetter} from 'lazy-get-decorator';
import {uniqueId} from 'lodash-es';
import {NgForage} from 'ngforage/src/lib';
import {OutputComponent} from '../output/output.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"main"',
    '[class.card-body]': 'true'
  },
  selector: 'ngf-storage-tab',
  templateUrl: './storage-tab.component.html'
})
export class StorageTabComponent {

  public config: any;

  @ViewChild('ngo', {static: false})
  public ngo: OutputComponent;

  @Input()
  public showCache = false;

  public constructor(public readonly ngf: NgForage) {
  }

  @LazyGetter()
  public get formName(): string {
    return uniqueId('config-form-');
  }

  public confChanged() {
    this.ngf.configure(this.config);
    this.ngo.detectChange();
  }
}
