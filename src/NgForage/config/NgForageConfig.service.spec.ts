import * as _ from 'lodash';
import {NgForageOptions} from "./NgForageOptions";
import {TestBed} from "@angular/core/testing";
import {module} from "../NgForage.module";
import {NgForageConfig} from "./NgForageConfig.service";
import 'localforage';
import {NgForage} from "../main/NgForage.service";

describe("NgForageConfig service", () => {
  let conf: NgForageConfig;
  let defaults: NgForageOptions;

  beforeEach(() => {
    TestBed.configureTestingModule(module);
    conf = TestBed.get(NgForageConfig);
    defaults = _.cloneDeep(conf.config);
  });

  afterEach(() => {
    conf.configure(_.cloneDeep(defaults));
  });

  it("#toJSON() should be the same as #config", () => {
    expect(conf.toJSON()).toEqual(conf.config);
  });

  it("toStringTag", () => {
    expect(conf.toString()).toContain('NgForageConfig');
  });

  describe("#defineDriver", () => {
    let spec: LocalForageDriver;
    let inst: NgForage;

    beforeAll(() => {
      spec = {
        _driver: __filename,
        _initStorage() {
        },
        _support: true,
        getItem() {
          return Promise.resolve(null)
        },
        setItem() {
          return Promise.resolve(null)
        },
        removeItem() {
          return Promise.resolve(null)
        },
        clear() {
          return Promise.resolve(null)
        },
        length() {
          return Promise.resolve(null)
        },
        key() {
          return Promise.resolve(null)
        },
        keys() {
          return Promise.resolve(null)
        },
        iterate() {
          return Promise.resolve(null)
        }
      };
      inst = TestBed.get(NgForage);
    });

    it("Custom driver should be unsupported initially", () => {
      expect(inst.supports(spec._driver)).toBe(false);
    });

    it("Defining driver should return void promise", done => {
      conf.defineDriver(spec)
        .then(v => {
          expect(v).toBeUndefined();
          done();
        })
        .catch(done);
    });

    it("Driver should now be supported", () => {
      expect(inst.supports(spec._driver)).toBe(true);
    });
  });

  describe('#configure', () => {
    it("Shouldn't fail with undefined", () => {
      expect(conf.configure(<any>undefined)).toBe(conf);
    });

    it("Setting config item should make it available inside instance", () => {
      conf.configure({cacheTime: 1});
      expect(conf.cacheTime).toBe(1);
    });
  });
});