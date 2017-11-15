import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {combineLatest} from 'rxjs/observable/combineLatest';
import {Subscription} from 'rxjs/Subscription';
import {NgForageCache} from '../../NgForage/cache/NgForageCache.service';
import {NgForageConfig} from '../../NgForage/config/NgForageConfig.service';
import {NgForage} from '../../NgForage/main/NgForage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgForage, NgForageCache],
  selector: 'ngf-demo',
  styleUrls: ['./DemoComponent.scss'],
  templateUrl: './DemoComponent.pug',
})
export class DemoComponent implements OnInit, OnDestroy {

  public form: FormGroup;

  public keys: Observable<string[]>;

  public readonly DRIVER_INDEXED_DB = NgForageConfig.DRIVER_INDEXEDDB;
  public readonly DRIVER_WEBSQL = NgForageConfig.DRIVER_WEBSQL;
  public readonly DRIVER_LOCALSTORAGE = NgForageConfig.DRIVER_LOCALSTORAGE;

  public readonly names = {
    [NgForageConfig.DRIVER_INDEXEDDB]: 'IndexedDB',
    [NgForageConfig.DRIVER_LOCALSTORAGE]: 'localStorage',
    [NgForageConfig.DRIVER_WEBSQL]: 'WebSQL'
  };

  private liveNgf: BehaviorSubject<NgForage>;

  private nameSub: Subscription;

  public constructor(private ngf: NgForage) {

  }

  public ngOnInit(): void {
    this.liveNgf = new BehaviorSubject<NgForage>(this.ngf);
    this.initForm();
    this.initSub();
    this.initKeys();
  }

  public ngOnDestroy(): void {
    this.nameSub.unsubscribe();
  }

  public async add() {
    await this.ngf.setItem(this.form.controls.key.value, this.form.controls.value.value);
    this.liveNgf.next(this.ngf);
  }

  public onRm() {
    this.liveNgf.next(this.ngf);
  }

  public async clear() {
    await this.ngf.clear();
    this.liveNgf.next(this.ngf);
  }

  private initKeys() {
    this.keys = this.liveNgf
      .switchMap(ngf => ngf.keys())
      .map(keys => keys.sort())
      .switchMap(keys => {
        // Force re-rendering
        const subj = new BehaviorSubject<string[]>([]);

        setTimeout(
          () => {
            subj.next(keys);
            subj.complete();
          },
          0
        );

        return subj;
      })
      .share();
  }

  private initSub() {
    const nameControl = this.form.controls.storeName;
    const engineControl = this.form.controls.engine;

    const name$ = nameControl.valueChanges.startWith(nameControl.value);
    const engine$ = engineControl.valueChanges.startWith(engineControl.value);

    this.nameSub = combineLatest(name$, engine$)
      .debounceTime(200) // tslint:disable-line:no-magic-numbers
      .subscribe((v: [string, string]) => {
        const [name, engine] = v;

        this.ngf.configure({name, driver: engine});
        this.liveNgf.next(this.ngf);
      });
  }

  private initForm() {
    this.form = new FormGroup({
      engine: new FormControl(NgForageConfig.DRIVER_INDEXEDDB),
      key: new FormControl(),
      storeName: new FormControl('ngfDemoDefault'),
      value: new FormControl()
    });
  }
}
