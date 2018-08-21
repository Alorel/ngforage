import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {uniqueId as uniqid} from 'lodash-es';
import {NgForageCache, NgForageOptions} from 'ngforage';
import {LazySubject, NgxDecorate} from 'ngx-decorate';
import {BehaviorSubject, Subject} from 'rxjs';
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {Proto} from 'typescript-proto-decorator';

@NgxDecorate()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ngf-output[conf]',
  templateUrl: './output.component.html'
})
export class OutputComponent {

  @Proto('')
  public getItemKey: string;
  @Proto(0)
  public keyIndex: number;
  @Proto('')
  public rmItemKey: string;
  @Proto(false)
  public setItemCacheOverrideCheck: boolean;
  @Proto(1000)
  public setItemCacheOverrideNum: number;
  @Proto(false)
  public setItemJson: boolean;
  @Proto('')
  public setItemKey: string;
  @Proto('')
  public setItemValue: string;
  @Input()
  public showCache = false;

  public constructor(private readonly ngf: NgForageCache,
                     private readonly cdr: ChangeDetectorRef) {
  }

  @Input()
  public set conf(conf: NgForageOptions) {
    this.ngf.configure(conf);
  }

  public get disableSetItem(): boolean {
    return !this.setItemKey || !this.setItemValue;
  }

  @LazySubject()
  public get error(): Subject<Error | null> {
    return new Subject<Error | null>();
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

  @LazySubject()
  public get output(): BehaviorSubject<any> {
    return new BehaviorSubject<any>(null);
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

  public get setItemText(): string {
    return this.setItemJson ? `JSON.parse('${this.setItemValue}')` : `'${this.setItemValue}'`;
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

  @LazyGetter()
  private get catcher() {
    return (e: any) => {
      this.error.next(e);
    };
  }

  public clear() {
    this.output.next('Clearing...');
    this.error.next(null);
    this.ngf.clear()
      .then(() => {
        this.output.next('Cleared!');
      })
      .catch(this.catcher);
  }

  public detectChange() {
    this.cdr.detectChanges();
  }

  public getItem() {
    this.output.next(`Getting ${this.getItemKey}...`);
    this.error.next(null);
    this.ngf.getItem<any>(this.getItemKey)
      .then((v: any) => {
        this.output.next(v);
      })
      .catch(this.catcher);
  }

  public getItemCached() {
    this.output.next(`Getting cached item ${this.getItemKey}...`);
    this.error.next(null);
    this.ngf.getCached<any>(this.getItemKey)
      .then((v: any) => {
        this.output.next(v);
      })
      .catch(this.catcher);
  }

  public iterate() {
    this.output.next('Iterating...');
    this.error.next(null);
    let out: string[] = [];
    this.ngf.iterate((value: string, key: string, itNum: number): void => {
        out.push(`[${itNum}] ${key}: ${value}`);
      })
      .then(() => {
        this.output.next(out);
      })
      .catch(this.catcher);
  }

  public key() {
    this.output.next(`Getting key @ index ${this.keyIndex}`);
    this.error.next(null);
    this.ngf.key(parseInt(<any>this.keyIndex, 10))
      .then((k: string) => {
        this.output.next(k);
      })
      .catch(this.catcher);
  }

  public keys() {
    this.output.next('Getting keys...');
    this.error.next(null);
    this.ngf.keys()
      .then((k: string[]) => {
        this.output.next(k);
      })
      .catch(this.catcher);
  }

  public length() {
    this.output.next('Getting length...');
    this.error.next(null);
    this.ngf.length()
      .then((r: number) => {
        this.output.next(r);
      })
      .catch(this.catcher);
  }

  public removeItem() {
    this.output.next(`Removing ${this.rmItemKey}...`);
    this.error.next(null);
    this.ngf.removeItem(this.rmItemKey)
      .then(() => {
        this.output.next(`${this.rmItemKey} removed!`);
      })
      .catch(this.catcher);
  }

  public removeItemCached() {
    this.output.next(`Removing cached item ${this.rmItemKey}...`);
    this.error.next(null);
    this.ngf.removeCached(this.rmItemKey)
      .then(() => {
        this.output.next(`Cached item ${this.rmItemKey} removed!`);
      })
      .catch(this.catcher);
  }

  public setItem() {
    this.output.next('Setting value...');
    this.error.next(null);
    try {
      this.ngf.setItem(this.setItemKey, this._setItemValue)
        .then(() => {
          this.output.next('Value set!');
        })
        .catch(this.catcher);
    } catch (e) {
      this.catcher(e);
    }
  }

  public setItemCached() {
    this.output.next('Setting cached item...');
    this.error.next(null);

    const args: any[] = [this.setItemKey, this._setItemValue];

    if (this.setItemCacheOverrideCheck) {
      args.push(this.setItemCacheOverrideNum);
    }

    this.ngf.setCached.apply(this.ngf, args)
      .then(() => {
        this.output.next('Cached item set!');
      })
      .catch(this.catcher);
  }
}