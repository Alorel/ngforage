import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, forwardRef, OnInit} from '@angular/core';
import {FormsModule, NG_VALUE_ACCESSOR} from '@angular/forms';
import {uniqueId as uniqid} from 'lodash-es';
import {Driver as D, NgForage} from 'ngforage';
import {AbstractFormControlComponent} from '../abstract-form-control';

interface Engine {
  elementID: string;

  id: D;

  name: string;

  supported: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {role: 'radiogroup'},
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EngineSelectComponent)
  }],
  selector: 'ngf-engine-select',
  standalone: true,
  templateUrl: './engine-select.component.html'
})
export class EngineSelectComponent extends AbstractFormControlComponent implements OnInit {

  public disabled = false;

  public engines: Engine[];

  public selected = '';

  public constructor(private readonly ngf: NgForage) {
    super();
  }

  /** @inheritDoc */
  public ngOnInit() {
    this.engines = [
      this.mkEngine(D.INDEXED_DB, 'IndexedDB'),
      this.mkEngine(D.WEB_SQL, 'WebSQL'),
      this.mkEngine(D.LOCAL_STORAGE, 'localStorage')
    ];
  }

  public onModelChange(newValue: string): void {
    this.selected = newValue;
    this.onChangeFn(newValue);
  }

  /** @inheritDoc */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.detectChanges();
  }

  /** @inheritDoc */
  public writeValue(obj: any): void {
    this.selected = obj;
    this.cdr.detectChanges();
  }

  private mkEngine(id: D, name: string): Engine {
    return {
      elementID: uniqid('engine-'),
      id,
      name,
      supported: this.ngf.supports(id)
    };
  }
}
