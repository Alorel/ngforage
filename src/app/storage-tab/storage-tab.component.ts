import {ChangeDetectionStrategy, Component, Inject, Input, ViewChild} from '@angular/core';
import uniqueId from 'lodash-es/uniqueId';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {NgForage, NgForageCache} from '../../';
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

  @ViewChild('ngo')
  public ngo: OutputComponent;

  @Input('showCache')
  public showCache = false;

  public constructor(@Inject(NgForageCache) public readonly ngf: NgForage) {
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
