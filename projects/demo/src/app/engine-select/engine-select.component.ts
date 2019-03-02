import {ChangeDetectionStrategy, Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {noop, uniqueId as uniqid} from 'lodash-es';
import {Driver as D, NgForage} from 'ngforage';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {Proto} from 'typescript-proto-decorator';

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

  @Proto(false)
  public _disabled: boolean;

  @Proto(noop)
  public _onBlurFn: Function;

  @Proto(noop)
  public _onChangeFn: Function;

  @Proto('')
  public selected: string;

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

  public registerOnChange(fn: any): void {
    this._onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onBlurFn = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

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
