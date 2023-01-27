import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {LazyGetter} from 'lazy-get-decorator';
import {uniqueId as uniqid} from 'lodash-es';
import {NgForageCache, NgForageOptions} from 'ngforage';
import {BehaviorSubject, catchError, EMPTY, from, last, Observable, Subject, takeUntil} from 'rxjs';
import {AsStringPipe} from '../asString.pipe';
import {ButtonStylingDirective} from '../button-styling.directive';
import {SetItemTextPipe} from './set-item-text.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,

    ButtonStylingDirective,
    AsStringPipe,
    SetItemTextPipe,
  ],
  selector: 'ngf-output[conf]',
  standalone: true,
  templateUrl: './output.component.html'
})
export class OutputComponent implements OnDestroy, OnInit {

  public error: Subject<Error | null>;

  public getItemKey = '';

  public keyIndex = 0;

  public output: BehaviorSubject<any>;

  public rmItemKey = '';

  public setItemCacheOverrideCheck = false;

  public setItemCacheOverrideNum = 1000;

  public setItemJson = false;

  public setItemKey = '';

  public setItemValue = '';

  @Input()
  public showCache = false;

  public constructor(
    private readonly ngf: NgForageCache,
    private readonly cdr: ChangeDetectorRef
  ) {
  }

  @Input()
  public set conf(conf: NgForageOptions) {
    this.ngf.configure(conf);
  }

  public get disableSetItem(): boolean {
    return !this.setItemKey || !this.setItemValue;
  }

  @LazyGetter()
  public get getItemId(): string {
    return uniqid('get-item-');
  }

  @LazyGetter()
  public get idKey(): string {
    return uniqid('key-');
  }

  @LazyGetter()
  public get idSetItemCacheOverrideCheck(): string {
    return uniqid('set-item-cache-override-check-');
  }

  @LazyGetter()
  public get idSetItemCacheOverrideNum(): string {
    return uniqid('set-item-cache-override-num-');
  }

  @LazyGetter()
  public get idSetItemJson(): string {
    return uniqid('set-item-json-parse-');
  }

  @LazyGetter()
  public get rmItemId(): string {
    return uniqid('remove-item-');
  }

  public get setItemCachedText(): string {
    const out: string[] = [
      `setCached('`,
      this.setItemKey,
      ', ',
      this.setItemJson ? `JSON.parse(${this.setItemValue})` : `'${this.setItemValue}'`
    ];

    if (this.setItemCacheOverrideCheck) {
      out.push(`, ${this.setItemCacheOverrideNum}`);
    }

    out.push(')');

    return out.join('');
  }

  @LazyGetter()
  public get setItemKeyId(): string {
    return uniqid('set-item-key-');
  }

  @LazyGetter()
  public get setItemValueId(): string {
    return uniqid('set-item-value-');
  }

  public get shouldDisableKey(): boolean {
    return isNaN(this.keyIndex);
  }

  private get _setItemValue(): any {
    return this.setItemJson ? JSON.parse(this.setItemValue) : this.setItemValue;
  }

  public clear(): void {
    this.output.next('Clearing...');
    this.error.next(null);
    this.doPromise(this.ngf.clear()).subscribe(() => {
      this.output.next('Cleared!');
    });
  }

  public detectChange() {
    this.cdr.markForCheck();
  }

  public getItem() {
    this.output.next(`Getting ${this.getItemKey}...`);
    this.error.next(null);
    this.doPromise(this.ngf.getItem<any>(this.getItemKey)).subscribe(v => {
      this.output.next(v);
    });
  }

  public getItemCached() {
    this.output.next(`Getting cached item ${this.getItemKey}...`);
    this.error.next(null);
    this.doPromise(this.ngf.getCached<any>(this.getItemKey))
      .subscribe(v => {
        this.output.next(v);
      });
  }

  public iterate() {
    this.output.next('Iterating...');
    this.error.next(null);
    let out: string[] = [];
    this
      .doPromise(
        this.ngf
          .iterate((value: string, key: string, itNum: number): void => {
            out.push(`[${itNum}] ${key}: ${value}`);
          })
      )
      .subscribe(() => {
        this.output.next(out);
      });
  }

  public key() {
    this.output.next(`Getting key @ index ${this.keyIndex}`);
    this.error.next(null);
    this.doPromise(this.ngf.key(parseInt(<any>this.keyIndex, 10)))
      .subscribe(k => {
        this.output.next(k);
      });
  }

  public keys() {
    this.output.next('Getting keys...');
    this.error.next(null);
    this.doPromise(this.ngf.keys())
      .subscribe(k => {
        this.output.next(k);
      });
  }

  public length() {
    this.output.next('Getting length...');
    this.error.next(null);
    this.doPromise(this.ngf.length())
      .subscribe((r: number) => {
        this.output.next(r);
      });
  }

  /** @inheritDoc */
  public ngOnDestroy(): void {
    if (this.error) {
      this.error.complete();
      this.output.complete();
    }
  }

  /** @inheritDoc */
  public ngOnInit(): void {
    this.output = new BehaviorSubject(null);
    this.error = new Subject();
  }

  public removeItem() {
    this.output.next(`Removing ${this.rmItemKey}...`);
    this.error.next(null);
    this.doPromise(this.ngf.removeItem(this.rmItemKey))
      .subscribe(() => {
        this.output.next(`${this.rmItemKey} removed!`);
      });
  }

  public removeItemCached() {
    this.output.next(`Removing cached item ${this.rmItemKey}...`);
    this.error.next(null);
    this.doPromise(this.ngf.removeCached(this.rmItemKey))
      .subscribe(() => {
        this.output.next(`Cached item ${this.rmItemKey} removed!`);
      });
  }

  public setItem() {
    this.output.next('Setting value...');
    this.error.next(null);
    try {
      this.doPromise(this.ngf.setItem(this.setItemKey, this._setItemValue))
        .subscribe(() => {
          this.output.next('Value set!');
        });
    } catch (e) {
      this.error.next(e as Error);
    }
  }

  public setItemCached() {
    this.output.next('Setting cached item...');
    this.error.next(null);

    const args: any[] = [this.setItemKey, this._setItemValue];

    if (this.setItemCacheOverrideCheck) {
      args.push(this.setItemCacheOverrideNum);
    }

    this.doPromise(this.ngf.setCached.apply(this.ngf, <any>args))
      .subscribe(() => {
        this.output.next('Cached item set!');
      });
  }

  private doPromise<P>(promise: Promise<P>): Observable<P> {
    return from(promise).pipe(
      catchError((e: any) => {
        this.error.next(e);

        return EMPTY;
      }),
      takeUntil(this.output.pipe(last()))
    );
  }
}
