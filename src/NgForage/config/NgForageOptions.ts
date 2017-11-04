import 'localforage';

export type NgForageOptions = LocalForageOptions & {
  cacheTime?: number
};