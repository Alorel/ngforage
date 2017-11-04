import {FactoryProvider, NgModule} from "@angular/core";
import {NgForageConfig} from "./config/NgForageConfig.service";
import {NgForage} from "./main/NgForage.service";
import {InstanceFactory} from "./instance-factory/InstanceFactory.service";
import {BaseConfigurableImpl} from "./config/BaseConfigurableImpl.service";

@NgModule({
  providers: [
    NgForage,
    <any>BaseConfigurableImpl,
    {provide: NgForageConfig, useFactory: NgForageConfig.factory} as FactoryProvider,
    {provide: InstanceFactory, useFactory: InstanceFactory.factory} as FactoryProvider
  ]
})
export class NgForageModule {

}