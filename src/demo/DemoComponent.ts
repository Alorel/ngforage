import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {NgForageCache} from '../NgForage/cache/NgForageCache.service';
import {NgForage} from '../NgForage/main/NgForage.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgForage, NgForageCache],
  selector: 'ngf-demo',
  templateUrl: './DemoComponent.pug'
})
export class DemoComponent implements OnInit, OnDestroy {

  public form: FormGroup;

  public keys: Observable<string[]>;

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

  public add() {
    return this.ngf.setItem(this.form.controls.key.value, this.form.controls.value.value)
      .then(() => this.liveNgf.next(this.ngf));
  }

  private initKeys() {
    this.keys = this.liveNgf
      .switchMap(ngf => ngf.keys())
      .map(keys => keys.sort())
      .share();
  }

  private initSub() {
    const control = this.form.controls.storeName;

    this.nameSub = control.valueChanges
      .startWith(control.value)
      .subscribe((v: string) => {
        this.ngf.name = v;
        this.liveNgf.next(this.ngf);
      });
  }

  private initForm() {
    this.form = new FormGroup({
      key: new FormControl(),
      storeName: new FormControl('ngfDemoDefault'),
      value: new FormControl()
    });
  }
}
