import {TestBed} from "@angular/core/testing";
import {NgForageConfig} from "../config/NgForageConfig.service";
import {NgForageCache} from "./NgForageCache.service";
import {module} from "../NgForage.module";
import * as _ from 'lodash';
import * as uuid from 'uuid';
import {NgForageOptions} from "../config/NgForageOptions";
import {CachedItem} from "./CachedItem";
import {CachedItemImpl} from "./CachedItemImpl";

describe("NgForageCache Service", () => {
  let conf: NgForageConfig;
  let cache: NgForageCache;
  let defaults: NgForageOptions;

  beforeEach(() => {
    TestBed.configureTestingModule(module);

    conf = TestBed.get(NgForageConfig);
    defaults = _.cloneDeep(conf.config);
    cache = TestBed.get(NgForageCache);
    cache.driver = NgForageConfig.DRIVER_LOCALSTORAGE;
  });

  it("NgForageConfig should be instantiated", () => {
    expect(conf instanceof NgForageConfig).toBe(true);
  });

  it("#toJSON cacheTime should be set", () => {
    expect(cache.toJSON().cacheTime).toBe(300000);
  });

  it("toStringTag should be set", () => {
    expect(cache.toString()).toContain('NgForageCache');
  });

  describe("Cache time", () => {
    it("Should be 1min after changing default", () => {
      try {
        conf.cacheTime = 60000;
        expect(cache.cacheTime).toBe(60000);
      } finally {
        conf.configure(_.cloneDeep(defaults));
      }
    });

    it("Should be 5min without changes", () => {
      expect(cache.cacheTime).toBe(300000);
    });

    it("Should be 2min after setting", () => {
      cache.cacheTime = 120000;
      expect(cache.cacheTime).toBe(120000);
    });
  });

  it("Getting a nonexistent item should return a null CachedItem", async done => {
    expect(await cache.getCached(uuid.v4())).toEqual(new CachedItemImpl(null, null));
    done();
  });

  describe("Full CRD", () => {
    const key: string = uuid.v4();
    const data = Math.random();

    it("Item should not exist initially", async done => {
      const item = await cache.getCached<string>(key);
      expect(item).toEqual(new CachedItemImpl(null, null));
      done();
    });

    it("Setting an item should return it", async done => {
      expect(await cache.setCached(key, data)).toEqual(data);
      done();
    });

    describe("Retrieving it again", () => {
      let ci: CachedItem<number>;

      beforeAll(async done => {
        ci = await cache.getCached<number>(key);
        done();
      });

      it("Should have a CachedItem with the data", () => {
        expect(ci.data).toBe(data);
      });

      it("That expires in ~5min", () => {
        expect(ci.expiresIn / 10000).toBeCloseTo(30, 0);
      });
    });

    describe("Deleting it", () => {
      it("Should return an empty promise", async done => {
        expect(await cache.removeCached(key)).toBeUndefined();
        done();
      });

      it("And make the item disappear", async done => {
        expect(await cache.getCached(key))
          .toEqual(new CachedItemImpl(null, null));
        done();
      });
    });
  });

  describe("Providing cache time in #setCached", () => {
    const key = uuid.v4();
    let item: CachedItem<string>;

    beforeAll(async done => {
      await cache.removeCached(key);
      await cache.setCached(key, uuid.v4(), 1000000);
      item = await cache.getCached<string>(key);
      done();
    });

    afterAll(async done => {
      await cache.removeCached(key);
      done();
    });

    it("Should override instance defaults", () => {
      expect(item.expiresIn / 1000).toBeCloseTo(1000, 0);
    });
  });
});