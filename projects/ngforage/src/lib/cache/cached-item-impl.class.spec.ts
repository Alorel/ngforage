import {CachedItem} from './cached-item';
import {CachedItemImpl} from './cached-item-impl.class';

//tslint:disable:no-floating-promises

describe('CachedItemImpl', () => {
  it('#toStringTag should be CachedItem', () => {
    const i = new CachedItemImpl<any>(null, 0);

    expect(i[Symbol.toStringTag]).toContain('CachedItem');
  });

  it('#toString should be a JSON.stringify', () => {
    const i = new CachedItemImpl<any>(null, 0);

    expect(i.toString()).toEqual(JSON.stringify(i));
  });

  describe('No data, no expiry time', () => {
    const c: CachedItemImpl<any> = new CachedItemImpl(null, 0);

    it('#hasData should be false', () => {
      expect(c.hasData).toBe(false);
    });

    it('#expiresIn should be 0', () => {
      expect(c.expiresIn).toBe(0);
    });

    it('#expired should be true', () => {
      expect(c.expired).toBe(true);
    });

    it('#expires should be Date(0)', () => {
      expect(c.expires).toEqual(new Date(0));
    });

    it('#data should be null', () => {
      expect(c.data).toBeNull();
    });

    it('#toJSON', () => {
      const eq: CachedItem<any> = {
        data: null,
        expired: true,
        expires: new Date(0),
        expiresIn: 0,
        hasData: false
      };

      expect(c.toJSON()).toEqual(eq);
    });
  });

  describe('With data and expiry time', () => {
    let c: CachedItemImpl<string>;
    let now: Date;

    const second = 1000;
    const div = 100;
    const closeTo = 10;

    beforeEach(() => {
      now = new Date();

      c = new CachedItemImpl('foo', now.getTime() + second);
    });

    it('#hasData should be true', () => {
      expect(c.hasData).toBe(true);
    });

    it('#expiresIn should be roughly 1000ms', () => {
      expect(c.expiresIn / div).toBeCloseTo(closeTo, 0);
    });

    it('#expired should be false', () => {
      expect(c.expired).toBe(false);
    });

    it('#expires should be ~1000ms in the future', () => {
      expect(c.expires).toEqual(new Date(now.getTime() + second));
    });

    it('#data should be \'foo\'', () => {
      expect(c.data).toBe('foo');
    });

    it('#toJSON', () => {
      const j = c.toJSON();

      expect(c.expiresIn / div).toBeCloseTo(closeTo, 0);
      expect(j.data).toBe('foo');
      expect(j.hasData).toBe(true);
      expect(j.expired).toBe(false);
      expect(j.expires).toEqual(new Date(now.getTime() + second));
    });
  });
});
