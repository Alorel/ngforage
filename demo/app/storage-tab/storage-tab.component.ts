import {ChangeDetectionStrategy, Component, Input, ViewChild} from '@angular/core';
import {FormsModule, NgModel} from '@angular/forms';
import {LazyGetter} from 'lazy-get-decorator';
import {uniqueId} from 'lodash-es';
import {NgForage} from 'ngforage';
import {FullConfigComponent} from '../full-config/full-config.component';
import {OutputComponent} from '../output/output.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: '"main"',
    '[class.card-body]': 'true'
  },
  imports: [
    FormsModule,

    FullConfigComponent,
    OutputComponent
  ],
  selector: 'ngf-storage-tab',
  standalone: true,
  templateUrl: './storage-tab.component.html'
})
export class StorageTabComponent {

  public readonly FORM_OPTS: NgModel['options'] = {standalone: true};

  public config: any;

  @ViewChild(OutputComponent)
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
