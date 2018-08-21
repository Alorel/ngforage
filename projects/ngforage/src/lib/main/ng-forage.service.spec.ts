import {TestBed} from '@angular/core/testing';
import {range} from 'lodash-es';
import {v4 as uuid} from 'uuid';
import {def} from '../../test.def';
import {NgForageCache} from '../cache/ng-forage-cache.service';
import {NgForageConfig} from '../config/ng-forage-config.service';
import {NgForage} from './ng-forage.service';

//tslint:disable:no-floating-promises

describe('NgForage core service', () => {
  let inst: NgForage;

  const clear = (done: any) => {
    inst.clear()
      .then(done)
      .catch(done);
  };

  beforeEach(() => {
    TestBed.configureTestingModule(def);
    inst = TestBed.get(NgForage);
    inst.driver = NgForageConfig.DRIVER_LOCALSTORAGE;
  });

  afterAll(clear);

  describe('#clone', () => {
    it('Should be the same type', () => {
      const clone = inst.clone();
      expect(clone instanceof NgForage).toEqual(true);
      expect(clone instanceof NgForageCache).toEqual(false);
    });

    it('Should have the same configuration if unconfigured', () => {
      expect(inst.clone()['finalConfig']).toEqual(inst['finalConfig']);
    });

    it('Should be configurable', () => {
      const name = uuid();
      const clone = inst.clone({name});
      const expected = Object.assign(inst['finalConfig'], {name});

      expect(clone['finalConfig']).toEqual(expected);
    });
  });

  it('#ready', done => {
    inst.ready()
      .then(r => expect(r).toBeUndefined())
      .then(done)
      .catch(done);
  });

  it('#activeDriver', done => {
    inst.ready()
      .then(() => {
        expect(inst.activeDriver).toBe(NgForageConfig.DRIVER_LOCALSTORAGE);
        done();
      })
      .catch(done);
  });

  describe('#keys', () => {
    beforeAll(clear);
    afterAll(clear);

    it('Should be empty initially', done => {
      inst.keys()
        .then(k => {
          expect(k).toEqual([]);
          done();
        })
        .catch(done);
    });

    it('And contain foo afterwards', done => {
      inst.setItem('foo', 'bar')
        .then(() => inst.keys())
        .then(k => {
          expect(k).toEqual(['foo']);
          done();
        })
        .catch(done);
    });
  });

  describe('get, set, remove item', () => {
    beforeAll(clear);
    afterAll(clear);

    const key = Math.random().toString();
    const get = async(done: any) => {
      expect(await inst.getItem(key)).toBeNull();
      done();
    };

    it('Getting initially should return null', get);

    it('Setting should return item set', async done => {
      expect(await inst.setItem(key, 'foo')).toBe('foo');
      done();
    });

    it('Getting item should return foo', async done => {
      expect(await inst.getItem(key)).toBe('foo');
      done();
    });

    it('Removing item should return void', async done => {
      // tslint:disable-next-line:no-void-expression
      expect(await inst.removeItem(key)).toBeUndefined();
      done();
    });

    it('And getting it should be null again', get);
  });

  describe('#supports', () => {
    beforeAll(async done => {
      await inst.ready();
      done();
    });

    const drivers = [
      NgForageConfig.DRIVER_LOCALSTORAGE,
      NgForageConfig.DRIVER_WEBSQL,
      NgForageConfig.DRIVER_INDEXEDDB,
      NgForageConfig.DRIVER_SESSIONSTORAGE
    ];

    for (const s of drivers) {
      it(`Should return boolean for support of ${s}`, () => {
        expect(typeof inst.supports(s)).toBe('boolean');
      });
    }

    it('Should not support an undefined driver', () => {
      expect(inst.supports(Math.random().toString())).toBe(false);
    });
  });

  describe('#key', () => {
    afterAll(clear);
    let k1: string;
    let k2: string;

    beforeAll(async done => {
      await inst.clear();
      await inst.setItem('bar', 1);
      await inst.setItem('foo', 1);
      k1 = await inst.key(0);
      k2 = await inst.key(1);

      done();
    });

    it('Key 1 should be either foo or bar', () => {
      expect(k1 === 'foo' || k1 === 'bar').toBe(true);
    });

    it('Key 2 should be foo or bar, but not the same as key 2', () => {
      let expct = k1 === 'foo' ? 'bar' : 'foo';

      expect(k2).toBe(expct);
    });
  });

  describe('#iterate', () => {
    afterAll(clear);
    beforeAll(async done => {
      await inst.clear();

      await inst.setItem('bar', 1);
      await inst.setItem('foo', 1);

      done();
    });

    describe('No early termination', () => {
      let out: string[] = [];

      it('Should return undefined', async done => {
        const p = inst.iterate<number, void>((v: number, k: string) => {
          out.push(`${k}:${v}`);
        });

        out.sort();
        // tslint:disable-next-line:no-void-expression
        expect(await p).toBeUndefined();
        done();
      });

      it('array should contain bar:1', () => {
        expect(out).toContain('bar:1');
      });
      it('array should contain foo:1', () => {
        expect(out).toContain('foo:1');
      });
    });

    describe('Early termination', () => {
      let out: string[] = [];

      it('Should return 5', async done => {
        const r = 5;

        const p = inst.iterate<number, number>((v: number, k: string) => {
          out.push(`${k}:${v}`);

          return r;
        });

        expect(await p).toBe(r);
        done();
      });

      it('array should contain one item', () => {
        expect(out.length).toBe(1);
      });
    });
  });

  describe('#clear & #length', () => {
    beforeAll(clear);
    afterAll(clear);

    const expectN = (n: number) => {
      return async(done: any) => {
        expect(await inst.length()).toBe(n);
        done();
      };
    };

    it('Length should be 0 initially', expectN(0));

    it('Setting 5 items should increase length to 5', async done => {
      const r = 5;

      await Promise.all(range(r).map((v: number) => inst.setItem(v.toString(), v)));

      expect(await inst.length()).toBe(r);
      done();
    });

    it('#clear() should return void', async done => {
      // tslint:disable-next-line:no-void-expression
      expect(await inst.clear()).toBeUndefined();
      done();
    });

    it('Length should be 0 again', expectN(0));
  });
});
