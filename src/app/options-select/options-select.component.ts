import {ChangeDetectionStrategy, Component, forwardRef, Inject, Input, OnDestroy} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import noop from 'lodash-es/noop';
import uniqid from 'lodash-es/uniqueId';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {map} from 'rxjs/operators/map';
import {startWith} from 'rxjs/operators/startWith';
import {Subscription} from 'rxjs/Subscription';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {NgForageConfig, NgForageOptions} from '../../';

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
  public _onBlur: Function = noop;
  public _showCacheTime: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _onChange: Function = noop;

  private _sub: Subscription;

  public constructor(@Inject(FormBuilder) private readonly fb: FormBuilder,
                     @Inject(NgForageConfig) private readonly cfg: NgForageConfig) {
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

    this._sub = combineLatest(gr.valueChanges.pipe(startWith(opts)), this._showCacheTime)
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

  public ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }

    this._showCacheTime.complete();
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
