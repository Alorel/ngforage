import {InjectionToken} from '@angular/core';
import type {NgForageOptions} from '../config';

/** Default ngforage configuration */
export const DEFAULT_CONFIG = new InjectionToken<NgForageOptions>('Default NgForage config');
