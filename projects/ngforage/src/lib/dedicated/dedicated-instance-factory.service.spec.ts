import {TestBed} from '@angular/core/testing';
import {v4 as uuid} from 'uuid';
import {def} from '../../test.def';
import {NgForageCache} from '../cache/ng-forage-cache.service';
import {NgForage} from '../main/ng-forage.service';
import {DedicatedInstanceFactory} from './dedicated-instance-factory.service';
import {NgForageCacheDedicated} from './ng-forage-cache-dedicated.class';
import {NgForageDedicated} from './ng-forage-dedicated.class';

//tslint:disable:no-floating-promises

describe('NgForaceDedicated', () => {
  let factory: DedicatedInstanceFactory;
  let id: string;

  beforeEach(() => {
    TestBed.configureTestingModule(def);
    factory = TestBed.inject(DedicatedInstanceFactory);
    id = uuid();
  });

  describe('createCache', () => {
    it('Should not be the same without config', () => {
      let i1 = factory.createCache();
      let i2 = factory.createCache();

      expect(i1).not.toBe(i2);
    });

    it('Should not be the same with config', () => {
      let i1 = factory.createCache({name: id});
      let i2 = factory.createCache({name: id});

      expect(i1).not.toBe(i2);
    });

    it('Should be instanceof cache', () => {
      expect(factory.createCache() instanceof NgForageCache).toBe(true);
    });

    describe('#clone', () => {
      it('Should default to previous config', () => {
        const clone = factory.createCache({name: id}).clone();
        expect(clone.name).toEqual(id);
      });

      it('Should be overridable', () => {
        const name = uuid();

        const clone = factory.createCache({name: id}).clone({name});
        expect(clone.name).toEqual(name);
      });

      it('Should still be instance of dedicated cache', () => {
        expect(factory.createCache().clone() instanceof NgForageCacheDedicated).toBe(true);
      });
    });
  });

  describe('createNgForage', () => {
    it('Should not be the same without config', () => {
      let i1 = factory.createNgForage();
      let i2 = factory.createNgForage();

      expect(i1).not.toBe(i2);
    });

    it('Should not be the same with config', () => {
      const name = uuid();
      let i1 = factory.createNgForage({name});
      let i2 = factory.createNgForage({name});

      expect(i1).not.toBe(i2);
    });

    it('Should be instanceof forage', () => {
      expect(factory.createNgForage() instanceof NgForage).toBe(true);
    });

    describe('#clone', () => {
      it('Should default to previous config', () => {
        const clone = factory.createNgForage({name: id}).clone();
        expect(clone.name).toEqual(id);
      });

      it('Should be overridable', () => {
        const name = uuid();

        const clone = factory.createNgForage({name: id}).clone({name});
        expect(clone.name).toEqual(name);
      });

      it('Should still be instance of dedicated forage', () => {
        expect(factory.createNgForage().clone() instanceof NgForageDedicated).toBe(true);
      });
    });
  });
});
