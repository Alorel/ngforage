/** @internal */
export function setToStringTag(clazz: Function, tag?: string): void {
  Object.defineProperty(clazz.prototype, Symbol.toStringTag, {
    configurable: false,
    enumerable: false,
    value: tag || clazz.name,
    writable: false
  });
}
