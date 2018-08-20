import {TestBed} from '@angular/core/testing';
import {cloneDeep} from 'lodash-es';
import * as uuid from 'uuid';
import {def} from '../../test.def';
import {NgForageConfig} from '../config/NgForageConfig.service';
import {NgForageOptions} from '../config/NgForageOptions';
import {CachedItem} from './CachedItem';
import {CachedItemImpl} from './CachedItemImpl';
import {NgForageCache} from './NgForageCache.service';

//tslint:disable:no-floating-promises

describe('NgForageCache Service', () => {
  let conf: NgForageConfig;
  let cache: NgForageCache;
  let defaults: NgForageOptions;

  const defaultCacheTime = 300000;

  beforeEach(() => {
    TestBed.configureTestingModule(def);

    conf = TestBed.get(NgForageConfig);
    defaults = cloneDeep(conf.config);
    cache = TestBed.get(NgForageCache);
    cache.driver = NgForageConfig.DRIVER_LOCALSTORAGE;
  });

  describe('#clone', () => {
    it('Should be the same type', () => {
      const clone = cache.clone();

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
    expect(conf instanceof NgForageConfig).toBe(true);
  });

  it('#toJSON cacheTime should be set', () => {
    expect(cache.toJSON().cacheTime).toBe(defaultCacheTime);
  });

  it('toString() should be a JSON.stringify', () => {
    expect(cache.toString()).toEqual(JSON.stringify(cache));
  });

  it('toStringTag should be set', () => {
    expect(cache[Symbol.toStringTag]).toContain('NgForageCache');
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
    expect(await cache.getCached(uuid.v4())).toEqual(new CachedItemImpl(null, null));
    done();
  });

  describe('Full CRD', () => {
    const key: string = uuid.v4();
    const data = Math.random();

    it('Item should not exist initially', async done => {
      const item = await cache.getCached<string>(key);
      expect(item).toEqual(new CachedItemImpl(null, null));
      done();
    });

    it('Setting an item should return it', async done => {
      expect(await cache.setCached(key, data)).toEqual(data);
      done();
    });

    describe('Retrieving it again', () => {
      let ci: CachedItem<number>;

      beforeAll(async done => {
        ci = await cache.getCached<number>(key);
        done();
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
          .toEqual(new CachedItemImpl(null, null));
        done();
      });
    });
  });

  describe('Providing cache time in #setCached', () => {
    const key = uuid.v4();
    let item: CachedItem<string>;

    beforeAll(async done => {
      await cache.removeCached(key);
      // tslint:disable-next-line:no-magic-numbers
      await cache.setCached(key, uuid.v4(), 1000000);
      item = await cache.getCached<string>(key);
      done();
    });

    afterAll(async done => {
      await cache.removeCached(key);
      done();
    });

    it('Should override instance defaults', () => {
      // tslint:disable-next-line:no-magic-numbers
      expect(item.expiresIn / 1000).toBeCloseTo(1000, 0);
    });
  });
});
