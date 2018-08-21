import {ChangeDetectionStrategy, Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {noop, uniqueId as uniqid} from 'lodash-es';
import {NgForageConfig, NgForageOptions} from 'ngforage';
import {LazySubject, NgxDecorate, Unsubscribe} from 'ngx-decorate';
import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {Proto} from 'typescript-proto-decorator';

const _sub: unique symbol = Symbol('sub');

interface Control {
  control: string;
  id: string;
  name: string;
  type?: string;
}

@NgxDecorate()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionsSelectComponent)
  }],
  selector: 'ngf-options-select',
  templateUrl: './options-select.component.html'
})
export class OptionsSelectComponent implements ControlValueAccessor {
  @Proto(noop)
  public _onBlur: Function;
  @Unsubscribe()
  public [_sub]: Subscription;
  @Proto(noop)
  private _onChange: Function;

  public constructor(private readonly fb: FormBuilder,
                     private readonly cfg: NgForageConfig) {
  }

  @LazySubject()
  public get _showCacheTime(): BehaviorSubject<boolean> {
    return new BehaviorSubject<boolean>(false);
  }

  @LazyGetter()
  public get controls(): Control[] {
    return [
      {
        control: 'name',
        id: uniqid('name-'),
        name: 'Name'
      },
      {
        control: 'storeName',
        id: uniqid('store-name-'),
        name: 'Store Name'
      },
      {
        control: 'description',
        id: uniqid('description-'),
        name: 'Description'
      },
      {
        control: 'size',
        id: uniqid('size-'),
        name: 'Size',
        type: 'number'
      },
      {
        control: 'version',
        id: uniqid('version-'),
        name: 'Version',
        type: 'number'
      }
    ];
  }

  @LazyGetter()
  public get form(): FormGroup {
    const opts: NgForageOptions = this.cfg.config;
    delete opts.driver;

    const gr: FormGroup = this.fb.group(opts);

    this[_sub] = combineLatest(gr.valueChanges.pipe(startWith(opts)), this._showCacheTime)
      .pipe(
        map((v: [NgForageOptions, boolean]): any => {
          const out: NgForageOptions = Object.assign({}, v[0]);
          out.version = parseInt(<any>out.version, 10);
          out.size = parseInt(<any>out.size, 10);

          if (!v[1]) {
            delete out.cacheTime;
          } else {
            out.cacheTime = parseInt(<any>out.cacheTime, 10);
          }

          return out;
        })
      )
      .subscribe((v: any) => {
        this._onChange(v);
      });

    return gr;
  }

  @LazyGetter()
  public get idCacheTime(): string {
    return uniqid('cache-time-');
  }

  @Input('showCacheTime')
  public set showCacheTime(show: boolean) {
    this._showCacheTime.next(show);
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onBlur = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  public writeValue(obj: any): void {
    this.form.patchValue(Object.assign({}, obj));
  }
}
