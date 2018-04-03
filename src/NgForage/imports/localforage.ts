import 'localforage';

const lf: any = require('localforage');

/** @internal */
export const localForage: LocalForage = 'defineDriver' in lf ? lf : lf.default;
