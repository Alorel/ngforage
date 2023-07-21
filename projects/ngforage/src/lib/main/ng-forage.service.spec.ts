import {TestBed} from '@angular/core/testing';
import {noop, range, values} from 'lodash-es';
import {v4 as uuid} from 'uuid';
import {def} from '../../test.def';
import {NgForageCache} from '../cache';
import {Driver} from '../misc/driver.enum';
import {NgForage} from './ng-forage.service';

describe('NgForage core service', () => {
  let inst: NgForage;

  beforeEach(() => {
    TestBed.configureTestingModule(def);
    inst = TestBed.inject(NgForage);
    inst.driver = Driver.LOCAL_STORAGE;
  });

  afterEach(async () => {
    try {
      await inst.clear();
    } catch {}
  });

  describe('#clone', () => {
    it('Should be the same type', () => {
      const clone: any = inst.clone();
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

  it('#activeDriver', async () => {
    await inst.ready();
    expect(inst.activeDriver).toBe(Driver.LOCAL_STORAGE);
  });

  describe('#keys', () => {
    it('Should be empty initially', async () => {
      await inst.clear();
      expect(await inst.keys()).toEqual([]);
    });

    it('And contain foo afterwards', async () => {
      await inst.clear();
      await inst.setItem('foo', 'bar');
      expect(await inst.keys()).toEqual(['foo']);
    });
  });

  describe('get, set, remove item', () => {
    const key = uuid();
    const get = async () => {
      expect(await inst.getItem(key)).toBeNull();
    };

    it('Getting initially should return null', get);

    it('Setting should return item set', async () => {
      expect(await inst.setItem(key, 'foo')).toBe('foo');
    });

    it('Getting item should return foo', async () => {
      const v = uuid();
      await inst.setItem(key, v);
      expect(await inst.getItem<string>(key)).toBe(v);
    });

    it('Removing item should return void', async () => {
      expect(await inst.removeItem(key)).toBeUndefined();
    });

    it('And getting it should be null again', get);
  });

  describe('#supports', () => {
    beforeEach(async () => {
      try {
        await inst.ready();
      } catch {}
    });

    const drivers = values(Driver);

    for (const s of drivers) {
      it(`Should return boolean for support of ${s}`, () => {
        expect(typeof inst.supports(s)).toBe('boolean');
      });
    }

    it('Should not support an undefined driver', () => {
      expect(inst.supports(uuid())).toBe(false);
    });
  });

  describe('#key', () => {
    let k1: string;
    let k2: string;

    beforeEach(async () => {
      await inst.clear();
      await Promise.all([
        inst.setItem('bar', 1)
          .then(() => inst.key(0))
          .then(v => {
            k1 = v;
          }),
        inst.setItem('foo', 1)
          .then(() => inst.key(1))
          .then(v => {
            k2 = v;
          })
      ]);
    });

    it('Key 1 should be either foo or bar', () => {
      expect(k1 === 'foo' || k1 === 'bar').withContext(`k1 was ${k1}`).toBe(true);
    });

    it('Key 2 should be foo or bar, but not the same as key 2', () => {
      const expct = k1 === 'foo' ? 'bar' : 'foo';

      expect(k2).toBe(expct);
    });
  });

  describe('#iterate', () => {
    beforeEach(async () => {
      await inst.clear();
      await Promise.all([
        inst.setItem('foo', 1),
        inst.setItem('bar', 1)
      ]);
    });

    describe('No early termination', () => {
      let out: string[];

      beforeEach(async () => {
        const ret: string[] = [];
        await inst
          .iterate<number, void>((value, key) => {
            ret.push(`${key}:${value}`);
          });
        ret.sort();
        out = ret;
      });

      it('Should return undefined', async () => {
        const p = inst.iterate<number, void>((v: number, k: string) => {
          noop(v, k);
        });

        expect(await p).toBeUndefined();
      });

      it('array should contain bar:1', () => {
        expect(out).toContain('bar:1');
      });
      it('array should contain foo:1', () => {
        expect(out).toContain('foo:1');
      });
    });

    describe('Early termination', () => {
      it('Should return test-generated uuid', async () => {
        const r = uuid();

        await inst.setItem(uuid(), uuid());
        const v = await inst.iterate<number, string>((v: number, k: string) => {
          noop(v, k);

          return r;
        });

        expect(v).toBe(r);
      });

      it('array should contain one item', async () => {
        await inst.setItem(uuid() + '1', uuid());
        await inst.setItem(uuid() + '2', uuid());

        const out: any[] = [];
        await inst
          .iterate<any, any>((value, key) => {
            out.push(`${key}:${value}`);

            return value;
          });

        expect(out.length).toBe(1);
      });
    });
  });

  describe('#clear & #length', () => {

    it('Length should be 0 initially', async () => {
      await inst.clear();
      expect(await inst.length()).toBe(0);
    });

    it('Setting 5 items should increase length to 5', async () => {
      const r = 5;

      await inst.clear();
      await Promise.all(range(r).map((v: number) => inst.setItem(v.toString(), v)));

      expect(await inst.length()).toBe(r);
    });

    it('#clear() should return void', async () => {
      expect(await inst.clear()).toBeUndefined();
    });
  });
});
