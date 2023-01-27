import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {LazyGetter} from 'lazy-get-decorator';
import {noop, uniqueId as uniqid} from 'lodash-es';
import {Driver as D, NgForage, NgForageConfig, NgForageOptions} from 'ngforage';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {AbstractFormControlComponent} from '../abstract-form-control';
import {AsStringPipe} from '../asString.pipe';
import {EngineSelectComponent} from '../engine-select/engine-select.component';
import {OptionsSelectComponent} from '../options-select/options-select.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    AsStringPipe,
    EngineSelectComponent,
    OptionsSelectComponent,
  ],
  providers: [
    {
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FullConfigComponent)
    }
  ],
  standalone: true,
  selector: 'ngf-full-config',
  templateUrl: './full-config.component.html'
})
export class FullConfigComponent extends AbstractFormControlComponent implements OnInit, OnDestroy {

  public _val: NgForageOptions;

  public engineLabelId: string;

  public form: FormGroup;

  @Input()
  public showCacheTime = false;

  public _sub: Subscription;

  private _onChange: any = noop;

  public constructor(
    private readonly fb: FormBuilder,
    private readonly ngf: NgForage,
    private readonly cfg: NgForageConfig
  ) {
    super();
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
    this._sub?.unsubscribe();
  }

  /** @inheritDoc */
  public ngOnInit(): void {
    this.engineLabelId = uniqid('engine-label-');

    this.form = this.fb.group({
      engine: this.fb.control(this._engineValue),
      otherConfig: this.otherConfig
    });

    type V = { engine: string; otherConfig: NgForageOptions };
    this._sub = (this.form.valueChanges as Observable<V>)
      .pipe(
        startWith(this.form.value as V),
        debounceTime(50),
        map(({engine, otherConfig}: V): NgForageOptions => ({
          ...otherConfig,
          driver: engine,
        })),
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
