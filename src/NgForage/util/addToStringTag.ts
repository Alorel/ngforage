/** @internal */
export type AddToStringTag = (target: any, tag: string) => void;

/** @internal */
export let addToStringTag: AddToStringTag;

//istanbul ignore else
if (typeof Symbol !== 'undefined') {
  addToStringTag = (target: any, tag: string) => {
    Object.defineProperty(target.prototype, Symbol['toStringTag'], {value: tag});
  };
} else {
  // tslint:disable-next-line:no-empty
  addToStringTag = () => {
  };
}
