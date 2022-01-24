import {TestBed} from '@angular/core/testing';
import 'localforage';
import {cloneDeep} from 'lodash-es';
import {v4 as uuid} from 'uuid';
import {def} from '../../test.def';
import {NgForage} from '../main';
import {NgForageConfig} from './ng-forage-config.service';
import type {NgForageOptions} from './ng-forage-options';

describe('NgForageConfig service', () => {
  let conf: NgForageConfig;
  let defaults: NgForageOptions;

  beforeEach(() => {
    TestBed.configureTestingModule(def);
    conf = TestBed.inject(NgForageConfig);
    defaults = cloneDeep(conf.config);
  });

  afterEach(() => {
    conf.configure(cloneDeep(defaults));
  });

  it('#toJSON() should be the same as #config', () => {
    expect(conf.toJSON()).toEqual(conf.config);
  });

  it('toString() should be a JSON.stringify', () => {
    expect(conf.toString()).toEqual(JSON.stringify(conf));
  });

  describe('#defineDriver', () => {
    let spec: LocalForageDriver;
    let inst: NgForage;

    beforeEach(() => {
      spec = {
        _driver: uuid(),
        _initStorage() {
        },
        _support: true,
        getItem() {
          return Promise.resolve<any>(null);
        },
        setItem() {
          return Promise.resolve<any>(null);
        },
        removeItem() {
          return Promise.resolve<any>(null);
        },
        clear() {
          return Promise.resolve<any>(null);
        },
        length() {
          return Promise.resolve<any>(null);
        },
        key() {
          return Promise.resolve<any>(null);
        },
        keys() {
          return Promise.resolve<any>(null);
        },
        iterate() {
          return Promise.resolve<any>(null);
        }
      };
      inst = TestBed.inject(NgForage);
    });

    it('Custom driver should be unsupported initially', () => {
      expect(inst.supports(spec._driver)).toBe(false);
    });

    it('Defining driver should return void promise', done => {
      conf.defineDriver(spec)
        .then(v => {
          expect(v).toBeUndefined();
          done();
        })
        .catch(done);
    });

    it('Driver should now be supported', done => {
      conf.defineDriver(spec)
        .then(() => {
          expect(inst.supports(spec._driver)).toBe(true);
          done();
        })
        .catch(done);
    });
  });

  describe('#configure', () => {
    it('Shouldn\'t fail with undefined', () => {
      expect(conf.configure(<any>undefined)).toBe(conf);
    });

    const confs: NgForageOptions = {
      cacheTime: 1,
      description: 'foo',
      driver: 'foo',
      name: 'foo',
      size: 1,
      storeName: 'foo',
      version: 1
    };

    for (const [key, val] of Object.entries(confs) as [keyof NgForageOptions, any][]) {
      describe(`${key}`, () => {
        const checkSetter = () => {
          expect(conf[key]).toBe(val);
        };
        const checkConfig = () => {
          expect(conf.config[key]).toBe(val);
        };

        describe('Set via configure()', () => {
          beforeEach(() => {
            conf.configure({[key]: val});
          });

          it('Should be gettable via getter', checkSetter);
          it('Should be gettable via #config', checkConfig);
        });

        describe('Set via setter', () => {
          beforeEach(() => {
            (conf as any)[key] = val;
          });

          it('Should be gettable via getter', checkSetter);
          it('Should be gettable via #config', checkConfig);
        });
      });
    }
  });

});
