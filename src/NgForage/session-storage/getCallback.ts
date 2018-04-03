/** @internal */
export function getCallback(): any {
  if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
    return arguments[arguments.length - 1];
  }
}
