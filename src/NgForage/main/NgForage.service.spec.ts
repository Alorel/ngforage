import {NgForage} from "./NgForage.service";
import {TestBed} from "@angular/core/testing";
import {def} from "../NgForage.module";
import {NgForageConfig} from "../config/NgForageConfig.service";
import * as _ from 'lodash';

describe("NgForage core service", () => {
  let inst: NgForage;

  const clear = done => {
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

  it("#ready", done => {
    inst.ready()
      .then(r => expect(r).toBeUndefined())
      .then(done)
      .catch(done);
  });

  it("#activeDriver", done => {
    inst.ready()
      .then(() => {
        expect(inst.activeDriver).toBe(NgForageConfig.DRIVER_LOCALSTORAGE);
        done();
      })
      .catch(done);
  });

  describe("#keys", () => {
    beforeAll(clear);
    afterAll(clear);

    it("Should be empty initially", done => {
      inst.keys()
        .then(k => {
          expect(k).toEqual([]);
          done();
        })
        .catch(done);
    });

    it("And contain foo afterwards", done => {
      inst.setItem('foo', 'bar')
        .then(() => inst.keys())
        .then(k => {
          expect(k).toEqual(['foo']);
          done();
        })
        .catch(done);
    });
  });

  describe("get, set, remove item", () => {
    beforeAll(clear);
    afterAll(clear);

    const key = Math.random().toString();
    const get = async done => {
      expect(await inst.getItem(key)).toBeNull();
      done();
    };

    it("Getting initially should return null", get);

    it("Setting should return item set", async done => {
      expect(await inst.setItem(key, 'foo')).toBe('foo');
      done();
    });

    it("Getting item should return foo", async done => {
      expect(await inst.getItem(key)).toBe('foo');
      done();
    });

    it("Removing item should return void", async done => {
      expect(await inst.removeItem(key)).toBeUndefined();
      done();
    });

    it("And getting it should be null again", get);
  });

  describe("#supports", () => {
    beforeAll(async done => {
      await inst.ready();
      done();
    });

    for (const s of [NgForageConfig.DRIVER_LOCALSTORAGE, NgForageConfig.DRIVER_WEBSQL, NgForageConfig.DRIVER_INDEXEDDB]) {
      it(`Should support ${s}`, () => {
        expect(inst.supports(s)).toBe(true);
      });
    }

    it("Should not support an undefined driver", () => {
      expect(inst.supports(Math.random().toString())).toBe(false);
    });
  });

  describe("#key", () => {
    afterAll(clear);
    beforeAll(async done => {
      await inst.clear();
      await inst.setItem('bar', 1);
      await inst.setItem('foo', 1);

      done();
    });

    it("Key 1 should be foo", async done => {
      expect(await inst.key(0)).toBe('bar');
      done();
    });

    it("Key 2 should be bar", async done => {
      expect(await inst.key(1)).toBe('foo');
      done();
    });
  });

  describe("#iterate", () => {
    afterAll(clear);
    beforeAll(async done => {
      await inst.clear();

      await inst.setItem('bar', 1);
      await inst.setItem('foo', 1);

      done();
    });

    describe("No early termination", () => {
      let out: string[] = [];

      it("Should return undefined", async done => {
        const p = inst.iterate<number, void>((v: number, k: string) => {
          out.push(`${k}:${v}`);
        });

        out.sort();
        expect(await p).toBeUndefined();
        done();
      });

      it("array should contain both items", () => {
        expect(out).toEqual(['bar:1', 'foo:1']);
      });
    });

    describe("Early termination", () => {
      let out: string[] = [];

      it("Should return 5", async done => {
        const p = inst.iterate<number, number>((v: number, k: string) => {
          out.push(`${k}:${v}`);
          return 5;
        });

        expect(await p).toBe(5);
        done();
      });

      it("array should contain one item", () => {
        expect(out.length).toBe(1);
      });
    });
  });

  describe("#clear & #length", () => {
    beforeAll(clear);
    afterAll(clear);

    const expectN = (n: number) => {
      return async done => {
        expect(await inst.length()).toBe(n);
        done();
      };
    };

    it("Length should be 0 initially", expectN(0));

    it("Setting 5 items should increase length to 5", async done => {
      await Promise.all(_.range(5).map((v: number) => inst.setItem(v.toString(), v)));

      expect(await inst.length()).toBe(5);
      done();
    });

    it("#clear() should return void", async done => {
      expect(await inst.clear()).toBeUndefined();
      done();
    });

    it("Length should be 0 again", expectN(0));
  });
});