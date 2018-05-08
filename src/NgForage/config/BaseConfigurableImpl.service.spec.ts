import {Injectable} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import 'localforage';
import * as _ from 'lodash';
import {def} from '../../test.def';
import {BaseConfigurableImpl} from './BaseConfigurableImpl.service';
import {NgForageConfig} from './NgForageConfig.service';
import {NgForageOptions} from './NgForageOptions';

describe('BaseConfigurableImpl', () => {

  @Injectable()
  class BC extends BaseConfigurableImpl {

    public getStore(): LocalForage {
      return this.store;
    }
  }

  let conf: NgForageConfig;
  let defaults: NgForageOptions;
  let bc: BC;

  afterEach(() => {
    conf.configure(_.cloneDeep(defaults));
  });

  beforeEach(() => {
    const stdConfig = _.cloneDeep(def);
    stdConfig.providers.push(BC);
    TestBed.configureTestingModule(stdConfig);

    conf = TestBed.get(NgForageConfig);
    defaults = _.cloneDeep(conf.config);

    bc = TestBed.get(BC);
  });

  it('toStringTag', () => {
    expect(bc[Symbol.toStringTag]).toContain('BaseConfigurable');
  });

  it('toString() should be a JSON.stringify', () => {
    expect(bc.toString()).toEqual(JSON.stringify(bc));
  });

  describe('get/set', () => {
    const tests = {
      description: ['foo', 'bar'],
      driver: ['foo', 'bar'],
      name: ['foo', 'bar'],
      // tslint:disable-next-line:no-magic-numbers
      size: [1, 2],
      storeName: ['foo', 'bar'],
      // tslint:disable-next-line:no-magic-numbers
      version: [1, 2]
    };

    _.forEach(tests, (v: [any, any], k: string) => {
      describe(k, () => {
        describe('@cfg', () => {
          beforeEach(() => {
            conf[k] = v[0];
          });

          it('via getter', () => {
            expect(bc[k]).toBe(v[0]);
          });

          it('via JSON', () => {
            expect(bc.toJSON()[k]).toBe(v[0]);
          });
        });

        describe('@instance', () => {
          beforeEach(() => {
            conf[k] = v[0];
            bc[k] = v[1];
          });

          it('via getter', () => {
            expect(bc[k]).toBe(v[1]);
          });

          it('via JSON', () => {
            expect(bc.toJSON()[k]).toBe(v[1]);
          });
        });
      });
    });

    // describe("driver", () => {
    //   it("@cfg", () => {
    //     conf.driver = 'foo';
    //
    //     expect(bc.driver).toBe('foo', 'getter');
    //     expect(bc.toJSON().driver).toBe('foo', 'JSON');
    //   });
    //
    //   it("@instance", () => {
    //     conf.driver = 'foo';
    //     bc.driver = 'bar';
    //
    //     expect(bc.driver).toBe('bar', 'getter');
    //     expect(bc.toJSON().driver).toBe('bar', 'JSON');
    //   })
    // });
  });

  describe('#storeNeedsRecalc', () => {
    let inst1: LocalForage;
    let inst2: LocalForage;
    let inst3: LocalForage;

    it('Passing a falsy value to configure() shouldn\'t cause trouble', () => {
      const conf1 = bc.toJSON();
      const ret = bc.configure(<any>undefined);
      const conf2 = bc.toJSON();

      expect(conf1).toEqual(conf2, 'Equality');
      expect(ret).toBe(bc, 'Same obj');
    });

    it('Configuring a driver should set the array appropriately', () => {
      bc.configure({driver: [NgForageConfig.DRIVER_LOCALSTORAGE, NgForageConfig.DRIVER_INDEXEDDB]});
      inst1 = bc.getStore();

      expect(bc.driver).toEqual([NgForageConfig.DRIVER_LOCALSTORAGE, NgForageConfig.DRIVER_INDEXEDDB]);
    });

    it('Configuring a driver with just one value should do the same', () => {
      bc.configure({driver: NgForageConfig.DRIVER_LOCALSTORAGE});
      inst2 = bc.getStore();

      expect(bc.driver).toBe(NgForageConfig.DRIVER_LOCALSTORAGE);
    });

    it('Setting driver via setter should achieve the same', () => {
      bc.driver = NgForageConfig.DRIVER_LOCALSTORAGE;
      inst3 = bc.getStore();

      expect(bc.driver).toBe(NgForageConfig.DRIVER_LOCALSTORAGE);
    });

    describe('Driver equalities', () => {
      it('1 !== 2', () => {
        expect(inst1).not.toBe(inst2);
      });

      it('1 !== 3', () => {
        expect(inst1).not.toBe(inst3);
      });

      it('2 === 3', () => {
        expect(inst2).toBe(inst3);
      });
    });
  });
});
