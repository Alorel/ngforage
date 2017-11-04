import {CachedItemImpl} from "./CachedItemImpl";
import {CachedItem} from "./CachedItem";

describe("CachedItemImpl", () => {
  it("#toStringTag should be CachedItem", () => {
    const i = new CachedItemImpl<any>(null, null);

    expect(i.toString()).toContain('CachedItem');
  });

  describe("No data, no expiry time", () => {
    const c: CachedItemImpl<any> = new CachedItemImpl(null, null);

    it("#hasData should be false", () => {
      expect(c.hasData).toBe(false);
    });

    it("#expiresIn should be 0", () => {
      expect(c.expiresIn).toBe(0);
    });

    it("#expired should be true", () => {
      expect(c.expired).toBe(true);
    });

    it("#expires should be Date(0)", () => {
      expect(c.expires).toEqual(new Date(0));
    });

    it("#data should be null", () => {
      expect(c.data).toBeNull();
    });

    it("#toJSON", () => {
      const eq: CachedItem<any> = {
        data: null,
        hasData: false,
        expired: true,
        expiresIn: 0,
        expires: new Date(0)
      };

      expect(c.toJSON()).toEqual(eq);
    });
  });

  describe("With data and expiry time", () => {
    let c: CachedItemImpl<string>;
    let now: Date;

    beforeEach(() => {
      now = new Date();
      c = new CachedItemImpl('foo', now.getTime() + 1000);
    });

    it("#hasData should be true", () => {
      expect(c.hasData).toBe(true);
    });

    it("#expiresIn should be roughly 1000ms", () => {
      expect(c.expiresIn / 100).toBeCloseTo(10, 0);
    });

    it("#expired should be false", () => {
      expect(c.expired).toBe(false);
    });

    it("#expires should be ~1000ms in the future", () => {
      expect(c.expires).toEqual(new Date(now.getTime() + 1000));
    });

    it("#data should be 'foo'", () => {
      expect(c.data).toBe('foo');
    });

    it("#toJSON", () => {
      const j = c.toJSON();

      expect(c.expiresIn / 100).toBeCloseTo(10, 0);
      expect(j.data).toBe('foo');
      expect(j.hasData).toBe(true);
      expect(j.expired).toBe(false);
      expect(j.expires).toEqual(new Date(now.getTime() + 1000));
    });
  });
});