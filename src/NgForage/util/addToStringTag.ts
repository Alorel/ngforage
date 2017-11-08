type AddToStringTag = (target: any, tag: string) => void;

/** @internal */
export let addToStringTag: AddToStringTag;

if (typeof Symbol !== 'undefined') {
  addToStringTag = (target, tag) => {
    target.prototype[Symbol['toStringTag']] = tag;
  };
} else {
  // tslint:disable-next-line:no-empty
  addToStringTag = () => {
  };
}
