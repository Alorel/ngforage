import {TestBed} from '@angular/core/testing';
import {noop, range, values} from 'lodash-es';
import {v4 as uuid} from 'uuid';
import {def} from '../../test.def';
import {NgForageCache} from '../cache/ng-forage-cache.service';
import {Driver} from '../misc/driver.enum';
import {NgForage} from './ng-forage.service';

//tslint:disable:no-floating-promises no-big-function

describe('NgForage core service', () => {
  let inst: NgForage;

  beforeEach(() => {
    TestBed.configureTestingModule(def);
    inst = TestBed.get(NgForage);
    inst.driver = Driver.LOCAL_STORAGE;
  });

  afterEach((done: any) => {
    inst.clear().then(done, done);
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

  it('#ready', done => {
    inst.ready()
      .then(r => expect(r).toBeUndefined())
      .then(done)
      .catch(done);
  });

  it('#activeDriver', done => {
    inst.ready()
      .then(() => {
        expect(inst.activeDriver).toBe(Driver.LOCAL_STORAGE);
        done();
      })
      .catch(done);
  });

  describe('#keys', () => {
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
    const key = uuid();
    const get = async (done: any) => {
      expect(await inst.getItem(key)).toBeNull();
      done();
    };

    it('Getting initially should return null', get);

    it('Setting should return item set', async done => {
      expect(await inst.setItem(key, 'foo')).toBe('foo');
      done();
    });

    it('Getting item should return foo', done => {
      const v = uuid();
      inst.setItem(key, v)
        .then(() => inst.getItem<string>(key))
        .then(returned => {
          expect(returned).toBe(v);
          done();
        })
        .catch(done);
    });

    it('Removing item should return void', async done => {
      // tslint:disable-next-line:no-void-expression
      expect(await inst.removeItem(key)).toBeUndefined();
      done();
    });

    it('And getting it should be null again', get);
  });

  describe('#supports', () => {
    beforeEach(done => {
      inst.ready().then(done, done);
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

    beforeEach(done => {
      inst.clear()
        .then(() => Promise.all([
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
        ]))
        .then(done, done);
    });

    it('Key 1 should be either foo or bar', () => {
      expect(k1 === 'foo' || k1 === 'bar').toBe(true, `k1 was ${k1}`);
    });

    it('Key 2 should be foo or bar, but not the same as key 2', () => {
      const expct = k1 === 'foo' ? 'bar' : 'foo';

      expect(k2).toBe(expct, `k2 was ${k2}; k1 was ${k1}`);
    });
  });

  describe('#iterate', () => {
    beforeEach(done => {
      inst.clear()
        .then(() => Promise.all([
          inst.setItem('foo', 1),
          inst.setItem('bar', 1)
        ]))
        .then(done, done);
    });

    describe('No early termination', () => {
      let out: string[];

      beforeEach(done => {
        const ret: string[] = [];
        inst
          .iterate<number, void>((value, key) => {
            ret.push(`${key}:${value}`);
          })
          .then(() => {
            ret.sort();
            out = ret;
            done();
          })
          .catch(done);
      });

      it('Should return undefined', async done => {
        const p = inst.iterate<number, void>((v: number, k: string) => {
          noop(v, k);
        });

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
      it('Should return test-generated uuid', done => {
        const r = uuid();

        inst.setItem(uuid(), uuid())
          .then(() => {
            return inst.iterate<number, string>((v: number, k: string) => {
              noop(v, k);

              return r;
            });
          })
          .then(v => {
            expect(v).toBe(r, `Value was ${v}`);
            done();
          })
          .catch(done);
      });

      it('array should contain one item', done => {
        inst.setItem(uuid() + '1', uuid())
          .then(() => inst.setItem(uuid() + '2', uuid()))
          .then(() => {
            const out: any[] = [];

            return inst
              .iterate<any, any>((value, key) => {
                out.push(`${key}:${value}`);

                return value;
              })
              .then(() => out);
          })
          .then(out => {
            expect(out.length).toBe(1);
            done();
          })
          .catch(done);
      });
    });
  });

  describe('#clear & #length', () => {

    it('Length should be 0 initially', done => {
      inst.length()
        .then(l => {
          expect(l).toBe(0);
          done();
        })
        .catch(done);
    });

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
  });
});
