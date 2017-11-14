# ngforage

[![Greenkeeper badge](https://badges.greenkeeper.io/Alorel/ngforage.svg)](https://greenkeeper.io/)

localForage bindings for Angular 4 and 5

[![Dependencies](https://img.shields.io/david/Alorel/ngforage.svg)](https://github.com/Alorel/ngforage/blob/master/package.json)
[![Peer Dependencies](https://img.shields.io/david/peer/Alorel/ngforage.svg)](https://github.com/Alorel/ngforage/blob/master/package.json)
[![Version](https://img.shields.io/npm/v/ngforage.svg)](https://www.npmjs.com/package/ngforage)
[![License](https://img.shields.io/npm/l/ngforage.svg)](https://github.com/Alorel/ngforage/blob/master/LICENSE)
[![Coverage Status](https://coveralls.io/repos/github/Alorel/ngforage/badge.svg?branch=1.0.0-rc.0)](https://coveralls.io/github/Alorel/ngforage?branch=1.0.0-rc.0)
[![Build Status](https://travis-ci.org/Alorel/ngforage.svg?branch=1.0.0-rc.0)](https://travis-ci.org/Alorel/ngforage)

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
  - [Local](#local)
  - [UMD+CDN](#umdcdn)
- [Importing the module](#importing-the-module)
- [Usage](#usage)
  - [Using the Standard Store](#using-the-standard-store)
  - [Using the Cache Store](#using-the-cache-store)
- [Configuration](#configuration)
  - [Global Configuration](#global-configuration)
  - [Instance-Level Configuration](#instance-level-configuration)
- [Store instances](#store-instances)
- [Defining a Driver](#defining-a-driver)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

## Local

```sh
npm install localforage
```

## UMD+CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ngforage@1.0.0-rc.0"></script>
<!-- The library is now available as "ngForage" -->
```

# Importing the module

```typescript
import {NgModule} from "@angular/core";
import {NgForageModule} from "ngforage";

@NgModule({
  imports: [
    NgForageModule
  ]
})
export class MyModule {

}
```

# Usage

## Using the Standard Store

```typescript
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {NgForage, NgForageConfig} from "ngforage";

@Component({
  selector: 'my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'foo'
})
export class MyComponent {

  constructor(private readonly ngf: NgForage) {

  }

  async getSomething() {
    const clickCount = await this.ngf.getItem<number>('clickCount');

    console.log(`${clickCount === null ? 'No' : clickCount} clicks.`);
  }

  async setSomething() {
    await this.ngf.setItem('foo', {bar: 'qux'});
  }

  async removeSomething() {
    await this.ngf.removeItem('foo');
  }

  async removeEverything() {
    await this.ngf.clear();
  }

  async getNumberOfItems() {
    console.log(`There are ${await this.ngf.length()} items stored!`);
  }

  async printKeysStored() {
    const keys: string[] = await this.ngf.keys();

    console.log('Keys:', keys.sort().join("\n"));
  }

  async checkIfDriverIsSupported() {
    const supports = this.ngf.supports(NgForageConfig.DRIVER_INDEXEDDB);

    console.log(`IndexedDB is ${supports ? '' : 'not '}supported`);
  }
}
```

## Using the Cache Store

The cache store can be used as a replacement for `NgForage`, but
also supports the following operations:

```typescript
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {CachedItem, NgForageCache} from "ngforage";

@Component({
  selector: 'my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'foo'
})
export class MyComponent {

  constructor(private readonly ngfc: NgForageCache) {

  }

  async setSomething() {
    // Use default expiry time
    await this.ngfc.setCached('foo', 'bar');

    // Cache for one minute
    await this.ngfc.setCached('qux', {baz: 1}, 60000);
  }

  async getSomething() {
    const item: CachedItem<string> = await this.ngfc.getCached<string>('foo');

    if (item.hasData) {
      console.log(`The item is ${item.data}`);
    } else {
      console.log('No data found');
    }

    if (item.expired) {
      console.log('Item has expired');
    } else {
      const expiryDate: Date = item.expires;

      console.log(`The item will expire in ${Math.round(item.expiresIn / 1000)} seconds, on ${expiryDate.toLocaleString()}`);
    }
  }

  async removeSomething() {
    await this.ngfc.removeCached('foo');
  }
}
```

# Configuration

## Global Configuration

```typescript
import {NgModule} from "@angular/core";
import {NgForageConfig, NgForageModule, NgForageOptions} from "ngforage";

@NgModule({
  imports: [
    NgForageModule
  ]
})
export class MyModule {

  constructor(conf: NgForageConfig) {
    // Set the database name
    conf.name = 'myDB';

    // Set the store name (e.g. in IndexedDB this is the dataStore)
    conf.storeName = 'my_store';

    // Set default cache time to 5 minutes
    conf.cacheTime = 300000;

    // Set driver to local storage
    conf.driver = NgForageConfig.DRIVER_LOCALSTORAGE;

    // Set the driver to indexed db if available,
    // falling back to websql
    // falling back to local storage
    conf.driver = [
      NgForageConfig.DRIVER_INDEXEDDB,
      NgForageConfig.DRIVER_WEBSQL,
      NgForageConfig.DRIVER_LOCALSTORAGE
    ];

    // Set websql database size
    conf.size = 1024 * 1024 * 4;

    // Set DB version. Currently unused.
    conf.version = 2.0;

    // Configure in bulk
    const bulk: NgForageOptions = {
      version: 3.0,
      name: 'newDB'
    };
    conf.configure(bulk);
  }
}
```

## Instance-Level Configuration

You can configure ngForage on an instance level. If need be, every
component can have its own instance:

```typescript
import {ChangeDetectionStrategy, Component} from "@angular/core";
import {NgForage, NgForageCache} from "ngforage";

@Component({
  selector: 'my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'foo',
  providers: [
    NgForage,
    NgForageCache
  ]
})
export class MyComponent {

  constructor(private readonly store: NgForage,
              private readonly cache: NgForageCache) {

  }
}
```

`NgForageCache` has the same setters as `NgForageConfig` whilst
`NgForage` supports all setters except `cacheTime`.

# Store instances

It is recommended to declare `NgForage` and/or `NgForageCache` in providers
if you're not using the default configuration. The running configuration
hash is used to create and reuse drivers (e.g. different IndexedDB
databases), therefore setting it on a shared instance might have
unintended side-effects.

# Defining a Driver

1. Define a driver as described in the [localForage docs](https://localforage.github.io/localForage/#driver-api-definedriver)
2. Plug it in, either directly through localForage or through `NgForageConfig`:

```typescript
import {NgModule} from "@angular/core";
import {NgForageConfig, NgForageModule} from "ngforage";
import * as localForage from 'localforage';

// Your driver definition
const myDriver: localForage.LocalForageDriver = {/*...*/};

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