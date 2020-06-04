import {TestBed} from '@angular/core/testing';
import {cloneDeep} from 'lodash-es';
import * as uuid from 'uuid';
import {def} from '../../test.def';
import {NgForageConfig} from '../config/ng-forage-config.service';
import {NgForageOptions} from '../config/ng-forage-options';
import {Driver} from '../misc/driver.enum';
import {CachedItem} from './cached-item';
import {CachedItemImpl} from './cached-item-impl.class';
import {NgForageCache} from './ng-forage-cache.service';

//tslint:disable:no-floating-promises

describe('NgForageCache Service', () => {
  let conf: NgForageConfig;
  let cache: NgForageCache;
  let defaults: NgForageOptions;

  const defaultCacheTime = 300000;

  beforeEach(() => {
    TestBed.configureTestingModule(def);

    conf = TestBed.inject(NgForageConfig);
    defaults = cloneDeep(conf.config);
    cache = TestBed.inject(NgForageCache);
    cache.driver = Driver.LOCAL_STORAGE;
  });

  describe('#clone', () => {
    it('Should be the same type', () => {
      const clone: any = cache.clone();

      expect(clone instanceof NgForageCache).toEqual(true);
    });

    it('Should have the same configuration if unconfigured', () => {
      expect(cache.clone()['finalConfig']).toEqual(cache['finalConfig']);
    });

    it('Should be configurable', () => {
      const name = uuid.v4();
      const clone = cache.clone({name});
      const expected = Object.assign(clone['finalConfig'], {name});

      expect(clone['finalConfig']).toEqual(expected);
    });
  });

  it('NgForageConfig should be instantiated', () => {
    expect(<any>conf instanceof NgForageConfig).toBe(true);
  });

  it('#toJSON cacheTime should be set', () => {
    expect(cache.toJSON().cacheTime).toBe(defaultCacheTime);
  });

  it('toString() should be a JSON.stringify', () => {
    expect(cache.toString()).toEqual(JSON.stringify(cache));
  });

  describe('Cache time', () => {
    it('Should be 1min after changing default', () => {
      try {
        const t = 600000;

        conf.cacheTime = t;
        expect(cache.cacheTime).toBe(t);
      } finally {
        conf.configure(cloneDeep(defaults));
      }
    });

    it('Should be 5min without changes', () => {
      expect(cache.cacheTime).toBe(defaultCacheTime);
    });

    it('Should be 2min after setting', () => {
      const t = 120000;

      cache.cacheTime = t;
      expect(cache.cacheTime).toBe(t);
    });
  });

  it('Getting a nonexistent item should return a null CachedItem', async done => {
    expect(await cache.getCached(uuid.v4())).toEqual(new CachedItemImpl<any>(null, 0));
    done();
  });

  describe('Full CRD', () => {
    const key: string = uuid.v4();
    const data: number = Math.random();

    afterEach(done => {
      cache.clear().then(done, done);
    });

    it('Item should not exist initially', async done => {
      const item = await cache.getCached<string>(key);
      expect(item).toEqual(new CachedItemImpl<any>(null, 0));
      done();
    });

    it('Setting an item should return it', async done => {
      expect(await cache.setCached(key, data)).toEqual(data);
      done();
    });

    describe('Retrieving it again', () => {
      let ci: CachedItem<number>;

      beforeEach(done => {
        cache.setCached(key, data)
          .then(() => cache.getCached<number>(key))
          .then(v => {
            ci = v;
            done();
          })
          .catch(done);
      });

      it('Should have a CachedItem with the data', () => {
        expect(ci.data).toBe(data);
      });

      it('That expires in ~5min', () => {
        // tslint:disable-next-line:no-magic-numbers
        expect(ci.expiresIn / 10000).toBeCloseTo(30, 0);
      });
    });

    describe('Deleting it', () => {
      it('Should return an empty promise', async done => {
        // tslint:disable-next-line:no-void-expression
        expect(await cache.removeCached(key)).toBeUndefined();
        done();
      });

      it('And make the item disappear', async done => {
        expect(await cache.getCached(key))
          .toEqual(new CachedItemImpl<any>(null, 0));
        done();
      });
    });
  });

  describe('Providing cache time in #setCached', () => {
    const key = uuid.v4();
    let item: CachedItem<string>;

    beforeEach(done => {
      // tslint:disable-next-line:no-magic-numbers
      cache.setCached(key, uuid.v4(), 1000000)
        .then(() => cache.getCached<string>(key))
        .then(v => {
          item = v;
          done();
        })
        .catch(done);
    });

    it('Should override instance defaults', () => {
      // tslint:disable-next-line:no-magic-numbers
      expect(item.expiresIn / 1000).toBeCloseTo(1000, 0);
    });
  });
});
