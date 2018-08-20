import {ChangeDetectionStrategy, Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {noop, uniqueId as uniqid} from 'lodash-es';
import {NgForage, NgForageConfig} from 'ngforage';
import {LazyGetter} from 'typescript-lazy-get-decorator';

interface Engine {
  elementID: string;
  id: string;
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

  public _disabled = false;
  public _onBlurFn: Function = noop;
  public _onChangeFn: Function = noop;
  public selected = '';

  public constructor(private readonly ngf: NgForage) {

  }

  @LazyGetter()
  public get engines(): Engine[] {
    return [
      {
        elementID: uniqid('engine-'),
        id: NgForageConfig.DRIVER_INDEXEDDB,
        name: 'IndexedDB',
        supported: this.ngf.supports(NgForageConfig.DRIVER_INDEXEDDB)
      },
      {
        elementID: uniqid('engine-'),
        id: NgForageConfig.DRIVER_WEBSQL,
        name: 'WebSQL',
        supported: this.ngf.supports(NgForageConfig.DRIVER_WEBSQL)
      },
      {
        elementID: uniqid('engine-'),
        id: NgForageConfig.DRIVER_LOCALSTORAGE,
        name: 'localStorage',
        supported: this.ngf.supports(NgForageConfig.DRIVER_LOCALSTORAGE)
      },
      {
        elementID: uniqid('engine-'),
        id: NgForageConfig.DRIVER_SESSIONSTORAGE,
        name: 'sessionStorage',
        supported: this.ngf.supports(NgForageConfig.DRIVER_SESSIONSTORAGE)
      }
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
}
