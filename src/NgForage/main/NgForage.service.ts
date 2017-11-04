import {Injectable} from "@angular/core";
import {BaseConfigurableImpl} from "../config/BaseConfigurableImpl.service";
import {BaseConfigurable} from "../config/BaseConfigurable";
import {addToStringTag} from "../util/addToStringTag";

/**
 * x
 */
@Injectable()
export class NgForage extends BaseConfigurableImpl implements BaseConfigurable {

  getItem<T>(key: string): Promise<T> {
    return this.store.getItem<T>(key);
  }

  setItem<T>(key: string, data: T): Promise<T> {
    return this.store.setItem<T>(key, data);
  }

  removeItem(key: string): Promise<void> {
    return this.store.removeItem(key);
  }

  clear(): Promise<void> {
    return this.store.clear();
  }

  length(): Promise<number> {
    return this.store.length();
  }

  key(index: number): Promise<string> {
    return this.store.key(index);
  }

  keys(): Promise<string[]> {
    return this.store.keys();
  }

  iterate<T, U>(iteratee: (value: T, key: string, iterationNumber: number) => U): Promise<U> {
    return this.store.iterate(iteratee);
  }

  activeDriver(): string {
    return this.store.driver();
  }

  supports(driver: string): boolean {
    return this.store.supports(driver);
  }

  ready(): Promise<void> {
    return this.store.ready();
  }
}

addToStringTag(NgForage, 'NgForage');