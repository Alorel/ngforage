import {ChangeDetectionStrategy, Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {LazyGetter} from 'lazy-get-decorator';
import {noop, uniqueId as uniqid} from 'lodash-es';
import {Driver as D, NgForage} from 'ngforage';

interface Engine {
  elementID: string;

  id: D;

  name: string;

  supported: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': '"radiogroup"'
  },
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EngineSelectComponent)
  }],
  selector: 'ngf-engine-select',
  templateUrl: './engine-select.component.html'
})
export class EngineSelectComponent implements ControlValueAccessor {

  public disabled = false;

  public selected = '';

  private onBlurFn: any = noop;

  private onChangeFn: any = noop;

  public constructor(private readonly ngf: NgForage) {
  }

  @LazyGetter()
  public get engines(): Engine[] {
    return [
      this.mkEngine(D.INDEXED_DB, 'IndexedDB'),
      this.mkEngine(D.WEB_SQL, 'WebSQL'),
      this.mkEngine(D.LOCAL_STORAGE, 'localStorage')
    ];
  }

  public onModelChange(newValue: string): void {
    this.selected = newValue;
    this.onChangeFn(newValue);
    this.onBlurFn();
  }

  /** @inheritDoc */
  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  /** @inheritDoc */
  public registerOnTouched(fn: any): void {
    this.onBlurFn = fn;
  }

  /** @inheritDoc */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /** @inheritDoc */
  public writeValue(obj: any): void {
    this.selected = obj;
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
