import {TestBed} from '@angular/core/testing';
import 'localforage';
import {cloneDeep} from 'lodash-es';
import {def} from '../../test.def';
import {NgForageConfig} from '../config/ng-forage-config.service';
import {NgForageOptions} from '../config/ng-forage-options';
import {InstanceFactory} from './instance-factory.service';

//tslint:disable:no-floating-promises

describe('Instance factory', () => {
  let i1: LocalForage;
  let i2: LocalForage;
  let i3: LocalForage;
  let i4: LocalForage;
  let i5: LocalForage;

  beforeEach(() => {
    TestBed.configureTestingModule(def);
    const fact: InstanceFactory = TestBed.inject(InstanceFactory);

    const getConf = (overrides: Partial<NgForageOptions> = {}): NgForageOptions => {
      const inst: NgForageConfig = TestBed.inject(NgForageConfig);
      const defaults = cloneDeep(inst.config);

      inst.configure(overrides);
      const conf = inst.config;
      inst.configure(defaults);

      return conf;
    };

    i1 = fact.getInstance(getConf({version: 2}));
    i2 = fact.getInstance(getConf({version: 2}));
    i3 = fact.getInstance(getConf({driver: ''}));
    i4 = fact.getInstance(<any>null);
    i5 = fact.getInstance({});
  });

  it('4 === 5', () => {
    expect(i4).toBe(i5);
  });

  it('1 === 2', () => {
    expect(i1).toBe(i2);
  });

  it('1 !== 3', () => {
    expect(i1).not.toBe(i3);
  });

  it('2 !== 3', () => {
    expect(i2).not.toBe(i3);
  });
});
