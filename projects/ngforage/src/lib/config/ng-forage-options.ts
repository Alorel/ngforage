import 'localforage';
import {DriverType} from '../misc/driver-type.type';

/** Localforage options with ngforage formatting */
export type FormattedLocalForageOptions = Omit<LocalForageOptions, 'driver'> & {
  driver?: DriverType | DriverType[];
};

/** NgForage configuration */
export type NgForageOptions = LocalForageOptions & FormattedLocalForageOptions & {
  /**
   * Cache time in milliseconds
   * @default 300000
   */
  cacheTime?: number;
};
