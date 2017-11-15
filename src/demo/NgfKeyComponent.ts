import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {NgForage} from '../NgForage/main/NgForage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngf-key[ngf][key]',
  template: '<strong>{{key}}</strong>: <span>{{value|async}}</span>'
})
export class NgfKeyComponent {

  @Input('key')
  public key: string;

  @Input('ngf')
  public ngf: NgForage;

  @LazyGetter()
  public get value(): Promise<string> {
    return this.ngf.getItem<string>(this.key);
  }
}
