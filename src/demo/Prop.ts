type PropDecorator = (target: any, prop: string) => void;

export function Prop(value: any, enumerable = true, configurable = false): PropDecorator {
  return function(target: any, propertyKey: string) {
    const proto = target.constructor.prototype;

    if (enumerable !== undefined) {
      Object.defineProperty(proto, propertyKey, {
        configurable,
        enumerable,
        value
      });
    } else {
      proto[propertyKey] = value;
    }
  };
}
