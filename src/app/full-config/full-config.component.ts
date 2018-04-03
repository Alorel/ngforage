import {ChangeDetectionStrategy, Component, forwardRef, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import noop from 'lodash-es/noop';
import uniqid from 'lodash-es/uniqueId';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {debounceTime} from 'rxjs/operators/debounceTime';
import {map} from 'rxjs/operators/map';
import {startWith} from 'rxjs/operators/startWith';
import {Subscription} from 'rxjs/Subscription';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {NgForage, NgForageConfig, NgForageConfig as C, NgForageOptions} from '../../';

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

  public _onBlur: Function = noop;
  public _val: any;
  @Input('showCacheTime')
  public showCacheTime = false;
  private _onChange: Function = noop;
  private _sub: Subscription;

  public constructor(@Inject(FormBuilder) private readonly fb: FormBuilder,
                     @Inject(NgForage) private readonly ngf: NgForage,
                     @Inject(NgForageConfig) private readonly cfg: NgForageConfig) {
  }

  @LazyGetter()
  public get engine(): FormControl {
    return this.fb.control(this._engineValue);
  }

  @LazyGetter()
  public get engineLabelId(): string {
    return uniqid('engine-label-');
  }

  @LazyGetter()
  public get otherConfig(): FormControl {
    const conf: NgForageOptions = this.cfg.config;
    delete conf.driver;

    return this.fb.control(conf);
  }

  private get _engineValue(): string {
    for (const engine of [C.DRIVER_INDEXEDDB, C.DRIVER_WEBSQL, C.DRIVER_LOCALSTORAGE, C.DRIVER_SESSIONSTORAGE]) {
      if (this.ngf.supports(engine)) {
        return engine;
      }
    }

    return C.DRIVER_LOCALSTORAGE;
  }

  public ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  public ngOnInit(): void {
    const eng$ = this.engine.valueChanges.pipe(startWith(this.engine.value));
    const cfg$ = this.otherConfig.valueChanges.pipe(startWith(this.otherConfig.value));

    this._sub = combineLatest(eng$, cfg$)
      .pipe(
        debounceTime(50), //tslint:disable-line:no-magic-numbers
        map((v: [string, NgForageOptions]): NgForageOptions => {
          const out: NgForageOptions = Object.assign({}, v[1]);
          out.driver = v[0];

          return out;
        })
      )
      .subscribe((v: NgForageConfig) => {
        this._onChange(v);
        this._val = v;
      });
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this._onBlur = fn;
  }

  public setDisabledState(isDisabled: boolean): void { //tslint:disable-line:no-empty
  }

  public writeValue(obj: NgForageOptions): void {
    obj = Object.assign({}, obj);

    if (obj.driver) {
      this.engine.setValue(obj.driver);
      delete obj.driver;
    }

    this.otherConfig.patchValue(obj);
  }
}
