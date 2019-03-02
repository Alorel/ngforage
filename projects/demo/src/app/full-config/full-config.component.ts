import {ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {noop, uniqueId as uniqid} from 'lodash-es';
import {Driver as D, NgForage, NgForageConfig, NgForageOptions} from 'ngforage';
import {combineLatest, Subscription} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {Proto} from 'typescript-proto-decorator';

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

  @Proto(noop)
  public _onBlur: Function;

  public _val: NgForageOptions;

  @Proto(false)
  @Input()
  public showCacheTime: boolean;

  public [_sub]: Subscription;

  @Proto(noop)
  private _onChange: Function;

  public constructor(private readonly fb: FormBuilder,
                     private readonly ngf: NgForage,
                     private readonly cfg: NgForageConfig) {
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

  private get _engineValue(): D {
    for (const engine of [D.INDEXED_DB, D.WEB_SQL, D.LOCAL_STORAGE]) {
      if (this.ngf.supports(engine)) {
        return engine;
      }
    }

    return D.LOCAL_STORAGE;
  }

  public ngOnDestroy(): void {
    if (this[_sub]) {
      this[_sub].unsubscribe();
    }
  }

  public ngOnInit(): void {
    const eng$ = this.engine.valueChanges.pipe(startWith(this.engine.value));
    const cfg$ = this.otherConfig.valueChanges.pipe(startWith(this.otherConfig.value));

    this[_sub] = combineLatest(eng$, cfg$)
      .pipe(
        debounceTime(50), //tslint:disable-line:no-magic-numbers
        map<[string, NgForageOptions], NgForageOptions>(v => {
          const out: NgForageOptions = Object.assign({}, v[1]);
          out.driver = v[0];

          return out;
        })
      )
      .subscribe(v => {
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

  public writeValue(obj: NgForageOptions): void {
    obj = Object.assign({}, obj);

    if (obj.driver) {
      this.engine.setValue(obj.driver);
      delete obj.driver;
    }

    this.otherConfig.patchValue(obj);
  }
}
