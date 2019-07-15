import 'localforage';
import {DriverType} from '../misc/driver-type.type';
import {Omit} from '../misc/omit.type';

/** Localforage options with ngforage formatting */
export type FormattedLocalForageOptions = Omit<LocalForageOptions, 'driver'> & {
  driver?: DriverType | DriverType[];
};

/** NgForage configuration */
export type NgForageOptions = FormattedLocalForageOptions & {
  /**
   * Cache time in milliseconds
   * @default 300000
   */
  cacheTime?: number;
};
