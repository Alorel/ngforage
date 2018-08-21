import {ModuleWithProviders, NgModule} from '@angular/core';
import {NgForageOptions} from './config/ng-forage-options';
import {DEFAULT_CONFIG} from './DEFAULT_CONFIG.token';
import './session-storage';

/**
 * NgForage core module
 */
@NgModule({})
export class NgForageModule {

  // istanbul ignore next
  public static forRoot(config: Partial<NgForageOptions> = {}): ModuleWithProviders {
    return {
      ngModule: NgForageModule,
      providers: [
        {
          provide: DEFAULT_CONFIG,
          useValue: Object.assign({}, config)
        }
      ]
    };
  }
}
