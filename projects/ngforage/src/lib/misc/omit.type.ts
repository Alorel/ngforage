import {Diff} from './diff.type';

/**
 * Instead of picking separate properties, omit them
 * @see http://ideasintosoftware.com/typescript-advanced-tricks/
 */
export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
