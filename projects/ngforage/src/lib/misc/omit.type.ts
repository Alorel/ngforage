/** Omit the given properties from the given type */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
