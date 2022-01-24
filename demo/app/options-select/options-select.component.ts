import {ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {LazyGetter} from 'lazy-get-decorator';
import {noop, uniqueId as uniqid} from 'lodash-es';
import {NgForageConfig, NgForageOptions} from 'ngforage';
import {BehaviorSubject, combineLatest, last, takeUntil} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface Control {
  control: string;

  id: string;

  name: string;

  type?: string;
}

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
export class OptionsSelectComponent implements ControlValueAccessor, OnDestroy {
  public _onBlur: any = noop;

  private _onChange: any = noop;

  private _showCacheTime: BehaviorSubject<boolean>;

  public constructor(
    private readonly fb: FormBuilder,
    private readonly cfg: NgForageConfig
  ) {
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
    this._showCacheTime = new BehaviorSubject<boolean>(false);
    const opts: NgForageOptions = this.cfg.config;
    delete opts.driver;

    const gr: FormGroup = this.fb.group(opts);

    combineLatest([gr.valueChanges.pipe(startWith(opts)), this._showCacheTime])
      .pipe(
        map(([opts, showCacheTime]: [NgForageOptions, boolean]): NgForageOptions => {
          const out: NgForageOptions = {...opts};
          out.version = parseInt(<any>out.version, 10);
          out.size = parseInt(<any>out.size, 10);

          if (showCacheTime) {
            out.cacheTime = parseInt(<any>out.cacheTime, 10);
          } else {
            delete out.cacheTime;
          }

          return out;
        }),
        takeUntil(this._showCacheTime.pipe(last()))
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

  public get showCacheTime(): boolean {
    return this._showCacheTime.value;
  }

  @Input('showCacheTime')
  public set showCacheTime(show: boolean) {
    this._showCacheTime.next(show);
  }

  /** @inheritDoc */
  public ngOnDestroy(): void {
    if (this._showCacheTime) {
      this._showCacheTime.complete();
    }
  }

  /** @inheritDoc */
  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  /** @inheritDoc */
  public registerOnTouched(fn: any): void {
    this._onBlur = fn;
  }

  /** @inheritDoc */
  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  /** @inheritDoc */
  public writeValue(obj: any): void {
    this.form.patchValue({...obj});
  }
}
