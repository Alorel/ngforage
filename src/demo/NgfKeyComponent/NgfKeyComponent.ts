import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForage} from '../../NgForage/main/NgForage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngf-key[ngf][key]',
  styleUrls: ['./NgfKeyComponent.scss'],
  templateUrl: './NgfKeyComponent.pug'
})
export class NgfKeyComponent implements OnInit {

  @Input('key')
  public key: string;

  @Input('ngf')
  public ngf: NgForage;

  @Output('rm')
  public readonly onRm = new EventEmitter<string>();

  public value: Promise<string>;

  public ngOnInit(): void {
    this.value = this.ngf.getItem<string>(this.key);
  }

  public async rm() {
    try {
      await this.ngf.removeItem(this.key);
    } finally {
      this.onRm.emit(this.key);
    }
  }
}
