/** @internal */
import {InjectionToken} from '@angular/core';
import {NgForageOptions} from './config/NgForageOptions';

export const DEFAULT_CONFIG = new InjectionToken<NgForageOptions>('Default NgForage config');
