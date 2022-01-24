import * as lf from 'localforage';

/** @internal */
export const localForage: LocalForage = 'defineDriver' in lf ? lf : (lf as any).default;
