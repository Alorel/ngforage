# ngforage

[localforage](https://www.npmjs.com/package/localforage) bindings for Angular

-----

[![NPM link](https://nodei.co/npm/ngforage.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/ngforage)

[![Build Status](https://travis-ci.org/Alorel/ngforage.svg?branch=5.0.1)](https://travis-ci.org/Alorel/ngforage)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/ngforage/badge.svg?branch=5.0.1)](https://coveralls.io/github/Alorel/ngforage?branch=5.0.1)
[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/ngforage.svg)](https://greenkeeper.io/)

* [Demo](https://alorel.github.io/ngforage/)
* [API documentation](https://alorel.github.io/ngforage/docs/)

-----

<details>
  <summary>Installation</summary>
  
  ```bash
   npm install localforage@^1.5.0 ngforage@^5.0.0 # for Angular 8
   npm install localforage@^1.5.0 ngforage@^4.0.0 # for Angular 7
   npm install localforage@^1.5.0 ngforage@^3.0.0 # for Angular 6
   npm install localforage@^1.5.0 ngforage@^2.0.0 # for Angular 5
  ```
  
  Alternatively, you can replace the following ngforage versions with a dist tag:
  
  ```bash
  npm install ngforage@ng7
  npm install ngforage@ng6
  npm install ngforage@ng5
  ```
</details>
<details>
  <summary>Basic Usage</summary>
  
  ```typescript
    import {NgForageModule, NgForageConfig, Driver} from 'ngforage';
    
    @NgModule({
      imports: [
        // Optional in Angular 6 and up
        NgForageModule.forRoot(),
        
        // Optional configuration as an alternative to what's below in Angular 6+
        NgForageModule.forRoot({
          name: 'MyApp',
          driver: [ // defaults to indexedDB -> webSQL -> localStorage
            Driver.INDEXED_DB,
            Driver.LOCAL_STORAGE
          ]
        })
      ]
    })
    export class AppModule{
      public constructor(ngfConfig: NgForageConfig) {
        ngfConfig.configure({
          name: 'MyApp',
          driver: [ // defaults to indexedDB -> webSQL -> localStorage
            Driver.INDEXED_DB,
            Driver.LOCAL_STORAGE
          ]
        });
      }
    }
  ```
  
  ```typescript
    import {NgForage, Driver, NgForageCache, NgForageConfig, CachedItem} from 'ngforage';

    @Component({
      /* If you plan on making per-component config adjustments, add the services to the component's providers
       * to receive fresh instances; otherwise, skip the providers section.
       */
      providers: [NgForage, NgForageCache]
    })
    class SomeComponent implements OnInit {
      constructor(private readonly ngf: NgForage, private readonly cache: NgForageCache) {}
      
      public getItem<T = any>(key: string): Promise<T> {
        return this.ngf.getItem<T>(key);
      }
      
      public getCachedItem<T = any>(key: string): Promise<T | null> {
        return this.cache.getCached<T>(key)
          .then((r: CachedItem<T>) => {
            if (!r.hasData || r.expired) {
              return null;
            }
            
            return r.data;
          })
      }
      
      public ngOnInit() {
        this.ngf.name = 'SomeStore';
        this.cache.driver = Driver.LOCAL_STORAGE;
      }
    }
  ```
</details>

<details>
  <summary>Store instances</summary>
  
  It is recommended to declare `NgForage` and/or `NgForageCache` in providers
  if you're not using the default configuration. The running configuration
  hash is used to create and reuse drivers (e.g. different IndexedDB
  databases), therefore setting it on a shared instance might have
  unintended side-effects.
</details>

<details>
  <summary>Defining a Driver</summary>
  
  1. Define a driver as described in the [localForage docs](https://localforage.github.io/localForage/#driver-api-definedriver)
  2. Plug it in, either directly through localForage or through `NgForageConfig`:
  
  ```typescript
  import {NgModule} from "@angular/core";
  import {NgForageConfig, NgForageModule} from 'ngforage';
  import localForage from 'localforage';
  
  // Your driver definition
  const myDriver: LocalForageDriver = {/*...*/};
  
  // Define it through localForage
  localForage.defineDriver(myDriver)
    .then(() => console.log('Defined!'))
    .catch(console.error);
  
  @NgModule({
    imports: [
      NgForageModule
    ]
  })
  export class DemoModule {
  
    constructor(conf: NgForageConfig) {
      // Or through NgForageConfig
      conf.defineDriver(myDriver)
        .then(() => console.log('Defined!'))
        .catch(console.error);
    }
  }
  ```
</details>
