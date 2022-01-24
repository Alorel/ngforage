import {ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {LazyGetter} from 'lazy-get-decorator';
import {noop, uniqueId as uniqid} from 'lodash-es';
import {Driver as D, NgForage, NgForageConfig, NgForageOptions} from 'ngforage';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';

const _sub: unique symbol = Symbol('sub');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FullConfigComponent)
    }
  ],
  selector: 'ngf-full-config',
  templateUrl: './full-config.component.html'
})
export class FullConfigComponent implements ControlValueAccessor, OnInit, OnDestroy {

  public _onBlur: any = noop;

  public _val: NgForageOptions;

  public engineLabelId: string;

  public form: FormGroup;

  @Input()
  public showCacheTime = false;

  public [_sub]: Subscription;

  private _onChange: any = noop;

  public constructor(
    private readonly fb: FormBuilder,
    private readonly ngf: NgForage,
    private readonly cfg: NgForageConfig
  ) {
  }

  private get _engineValue(): D {
    for (const engine of [D.INDEXED_DB, D.WEB_SQL, D.LOCAL_STORAGE]) {
      if (this.ngf.supports(engine)) {
        return engine;
      }
    }

    return D.LOCAL_STORAGE;
  }

  @LazyGetter()
  private get otherConfig(): FormControl {
    const conf: NgForageOptions = this.cfg.config;
    delete conf.driver;

    return this.fb.control(conf);
  }

  /** @inheritDoc */
  public ngOnDestroy(): void {
    this[_sub]?.unsubscribe();
  }

  /** @inheritDoc */
  public ngOnInit(): void {
    this.engineLabelId = uniqid('engine-label-');
    this.form = this.fb.group({
      engine: this.fb.control(this._engineValue),
      otherConfig: this.otherConfig
    });

    type V = { engine: string; otherConfig: NgForageOptions };
    this[_sub] = (this.form.valueChanges as Observable<V>)
      .pipe(
        startWith(this.form.value as V),
        debounceTime(50),
        map(({engine, otherConfig}: V): NgForageOptions => {
          const out: NgForageOptions = {...otherConfig};
          out.driver = engine;

          return out;
        })
      )
      .subscribe({
        error: console.error,
        next: value => {
          this._val = value;
          this._onChange(value);
        }
      });
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
  public writeValue(obj: NgForageOptions): void {
    const w = {...obj};

    const patch: any = {};
    if (w.driver) {
      patch.engine = w.driver;
      delete w.driver;
    }
    patch.otherConfig = w;

    this.form.patchValue(patch);
  }
}
