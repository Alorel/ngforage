import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {LazyGetter} from 'lazy-get-decorator';
import {uniqueId as uniqid} from 'lodash-es';
import {NgForageConfig, NgForageOptions} from 'ngforage';
import {BehaviorSubject, combineLatest, last, takeUntil} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AbstractFormControlComponent} from '../abstract-form-control';

interface Control {
  control: string;

  id: string;

  name: string;

  type?: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [{
    multi: true,
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OptionsSelectComponent)
  }],
  selector: 'ngf-options-select',
  standalone: true,
  templateUrl: './options-select.component.html'
})
export class OptionsSelectComponent extends AbstractFormControlComponent implements OnDestroy, OnInit {

  public controls: Control[];

  public form: FormGroup;

  private readonly _showCacheTime = new BehaviorSubject<boolean>(false);

  public constructor(
    private readonly fb: FormBuilder,
    private readonly cfg: NgForageConfig
  ) {
    super();
  }

  @LazyGetter()
  public get idCacheTime(): string {
    return uniqid('cache-time-');
  }

  public get showCacheTime(): boolean {
    return this._showCacheTime.value;
  }

  @Input()
  public set showCacheTime(show: boolean) {
    if (show !== this.showCacheTime) {
      this._showCacheTime.next(show);
    }
  }

  /** @inheritDoc */
  public ngOnDestroy(): void {
    this._showCacheTime.complete();
  }

  /** @inheritDoc */
  public ngOnInit() {
    this.controls = [
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

    const opts: NgForageOptions = this.cfg.config;
    delete opts.driver;

    this.form = this.fb.group(opts);

    combineLatest([this.form.valueChanges.pipe(startWith(opts)), this._showCacheTime])
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
        this.onChangeFn(v);
      });
  }

  /** @inheritDoc */
  public setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
    this.cdr.detectChanges();
  }

  /** @inheritDoc */
  public writeValue(obj: any): void {
    this.form.patchValue({...obj});
    this.cdr.detectChanges();
  }
}
