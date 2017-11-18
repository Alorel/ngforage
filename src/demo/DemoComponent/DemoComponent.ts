import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
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
import {LazyGetter} from 'typescript-lazy-get-decorator';
import {NgForageCache} from '../../NgForage/cache/NgForageCache.service';
import {NgForageConfig} from '../../NgForage/config/NgForageConfig.service';
import {NgForage} from '../../NgForage/main/NgForage.service';
import {ImgLinkSpec} from '../ImgLink/ImgLink';
import {ServiceWorkerRegistrator} from '../ServiceWorkerRegistrator';
import {StaticConf} from '../StaticConf';

@Component({
             changeDetection: ChangeDetectionStrategy.OnPush,
             providers:       [NgForage, NgForageCache],
             selector:        'ngf-demo',
             styleUrls:       ['./DemoComponent.scss'],
             templateUrl:     './DemoComponent.pug'
           })
export class DemoComponent implements OnInit, OnDestroy, AfterViewInit {
  private nameSub: Subscription;

  public constructor(private readonly ngf: NgForage, private readonly sw: ServiceWorkerRegistrator) {

  }

  @LazyGetter(true)
  public get availableDrivers(): string[] {
    const r = Object.keys(this.names)
                    .filter(name => this.ngf.supports(name));
    Object.freeze(r);

    return r;
  }

  @LazyGetter()
  public get form(): FormGroup {
    return new FormGroup({
                           engine:    new FormControl(NgForageConfig.DRIVER_INDEXEDDB),
                           key:       new FormControl(),
                           storeName: new FormControl('ngfDemoDefault'),
                           value:     new FormControl()
                         });
  }

  @LazyGetter(true)
  public get imgLinks(): ImgLinkSpec[] {
    return [
      {
        alt:  'Release',
        img:  `https://img.shields.io/github/release/Alorel/ngforage.svg?style=flat-square`,
        link: `${StaticConf.HOMEPAGE}/releases`
      },
      {
        alt:  'Build Status',
        img:  'https://travis-ci.org/Alorel/ngforage.svg?branch=master',
        link: 'https://travis-ci.org/Alorel/ngforage'
      },
      {
        alt:  'Dependencies',
        img:  'https://img.shields.io/david/Alorel/ngforage.svg?style=flat-square',
        link: 'https://github.com/Alorel/ngforage/blob/master/package.json'
      },
      {
        alt:  'Peer Dependencies',
        img:  'https://img.shields.io/david/peer/Alorel/ngforage.svg?style=flat-square',
        link: 'https://github.com/Alorel/ngforage/blob/master/package.json'
      }
    ];
  }

  @LazyGetter()
  public get keys(): Observable<string[]> {
    return this.liveNgf
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

  @LazyGetter(true)
  public get names() {
    const r = {
      [NgForageConfig.DRIVER_INDEXEDDB]:    'IndexedDB',
      [NgForageConfig.DRIVER_LOCALSTORAGE]: 'localStorage',
      [NgForageConfig.DRIVER_WEBSQL]:       'WebSQL'
    };

    Object.freeze(r);

    return r;
  }

  @LazyGetter()
  private get liveNgf(): BehaviorSubject<NgForage> {
    return new BehaviorSubject<NgForage>(this.ngf);
  }

  public async add() {
    await this.ngf.setItem(this.form.controls.key.value, this.form.controls.value.value);
    this.liveNgf.next(this.ngf);
  }

  public async clear() {
    await this.ngf.clear();
    this.liveNgf.next(this.ngf);
  }

  public ngOnDestroy(): void {
    this.nameSub.unsubscribe();
  }

  public onRm() {
    this.liveNgf.next(this.ngf);
  }

  public ngOnInit(): void {
    const nameControl   = this.form.controls.storeName;
    const engineControl = this.form.controls.engine;

    const name$   = nameControl.valueChanges.startWith(nameControl.value);
    const engine$ = engineControl.valueChanges.startWith(engineControl.value);

    this.nameSub = combineLatest(name$, engine$)
      .debounceTime(StaticConf.DEBOUNCE_TIME)
      .subscribe((v: [string, string]) => {
        const [name, driver] = v;

        this.ngf.configure({name, driver});
        this.liveNgf.next(this.ngf);
      });
  }

  public ngAfterViewInit(): void {
    this.sw.register();
  }
}
