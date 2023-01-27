import {ChangeDetectorRef, Directive, inject} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {noop} from 'lodash-es';

@Directive()
export abstract class AbstractFormControlComponent implements ControlValueAccessor {

  public onBlurFn: any = noop;

  protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  protected onChangeFn: any = noop;

  /** @inheritDoc */
  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  /** @inheritDoc */
  public registerOnTouched(fn: any): void {
    this.onBlurFn = fn;
  }

  /** @inheritDoc */
  public abstract writeValue(obj: any): void;
}
