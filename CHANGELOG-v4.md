## [4.0.3](https://github.com/Alorel/ngforage/compare/4.0.2...4.0.3) (2019-03-02)


### Maintenance

* **demo:** Upgrade lazy get and proto dependencies ([067f9de](https://github.com/Alorel/ngforage/commit/067f9de))
* Lower required tslib version to 1.6.0 ([3a2c90b](https://github.com/Alorel/ngforage/commit/3a2c90b))


### Refactoring

* Remove typescript-lazy-get-decorator dependency ([ad0c313](https://github.com/Alorel/ngforage/commit/ad0c313))
* Remove typescript-proto-decorator dependency ([086a129](https://github.com/Alorel/ngforage/commit/086a129))

## [4.0.2](https://github.com/Alorel/ngforage/compare/4.0.1...4.0.2) (2019-01-15)


### Bug Fixes

* CachedItem.hasData now returns false if the value is undefined ([08fb1d9](https://github.com/Alorel/ngforage/commit/08fb1d9))


### Maintenance

* ignore jasmine updates ([fb084d2](https://github.com/Alorel/ngforage/commit/fb084d2))
* Update deps ([4d5131f](https://github.com/Alorel/ngforage/commit/4d5131f))

## [4.0.1](https://github.com/Alorel/ngforage.git/compare/4.0.0...4.0.1) (2018-10-31)


### Maintenance

* Remove tslint as explicit dependency, set ng version to ^7.0.0 ([78917bb](https://github.com/Alorel/ngforage.git/commit/78917bb))
* Update ngforage service test for new tslint rules ([b50a006](https://github.com/Alorel/ngforage.git/commit/b50a006))


### Refactoring

* DEFAULT_CONFIG injection token no longer flagged as internal ([1232362](https://github.com/Alorel/ngforage.git/commit/1232362))
* NgForageModule.forRoot config param refactored as optional ([210080a](https://github.com/Alorel/ngforage.git/commit/210080a))
* Remove diff type in favour of the built-in Exclude type ([191ac66](https://github.com/Alorel/ngforage.git/commit/191ac66))

# [4.0.0](https://github.com/Alorel/ngforage/compare/3.4.0...4.0.0) (2018-10-09)


### Bug Fixes

* Fixed remaining strict tsc issues ([33be81d](https://github.com/Alorel/ngforage/commit/33be81d))


### Dependency updates

* Greenkeeper/tsickle 0.32.0 (#76) ([6b17efd](https://github.com/Alorel/ngforage/commit/6b17efd)), closes [#76](https://github.com/Alorel/ngforage/issues/76) [#75](https://github.com/Alorel/ngforage/issues/75)
* Update ts-node to the latest version 🚀 (#73) ([0c552d8](https://github.com/Alorel/ngforage/commit/0c552d8)), closes [#73](https://github.com/Alorel/ngforage/issues/73)
* Update tsickle to the latest version 🚀 (#72) ([342fd68](https://github.com/Alorel/ngforage/commit/342fd68)), closes [#72](https://github.com/Alorel/ngforage/issues/72)
* Update ng-packagr to the latest version 🚀 (#70) ([4572a30](https://github.com/Alorel/ngforage/commit/4572a30)), closes [#70](https://github.com/Alorel/ngforage/issues/70)
* Update tsickle to the latest version 🚀 (#69) ([a048a6f](https://github.com/Alorel/ngforage/commit/a048a6f)), closes [#69](https://github.com/Alorel/ngforage/issues/69)


### Documentation

* Add MIGRATING.md ([46258c5](https://github.com/Alorel/ngforage/commit/46258c5))
* Update README.md for 4.0 ([e8ea7fb](https://github.com/Alorel/ngforage/commit/e8ea7fb))


### Maintenance

* **package:** Remove jsdelivr link ([ffa36b4](https://github.com/Alorel/ngforage/commit/ffa36b4))
* Drop session storage from library ([6aa76e3](https://github.com/Alorel/ngforage/commit/6aa76e3))


### Performance Improvements

* **demo:** Removed unnecessary decorators, heavier use of prototypes, observables and subjects now handled with NgxDecorate ([89ae9b0](https://github.com/Alorel/ngforage/commit/89ae9b0))


### Refactoring

* Initial migration to ng7, angular-cli>=6.2.0 and yarn ([fa3dd35](https://github.com/Alorel/ngforage/commit/fa3dd35))
* Rename library files in Angular format ([4b8cc7c](https://github.com/Alorel/ngforage/commit/4b8cc7c))
* **internal:** use @Proto decorator where appropriate, resolve strict mode tsc errors ([517f985](https://github.com/Alorel/ngforage/commit/517f985))
* Replaced driver static props on NgForageConfig with Driver enum. ([550f758](https://github.com/Alorel/ngforage/commit/550f758))
* Use Proto decorator where appropriate ([e5c4475](https://github.com/Alorel/ngforage/commit/e5c4475))


* try fix release (III) ([4648e8e](https://github.com/Alorel/ngforage/commit/4648e8e))


### BREAKING CHANGES

* sessionStorage is no longer supported by default. If you need sessionStorage support you can use the [localforage-driver-session-storage](https://npmjs.com/package/localforage-driver-session-storage) package.
* Driver names are now accessed via `import {Driver} from 'ngforage'`. See [migration notes](https://github.com/Alorel/ngforage/blob/4.0.0/MIGRATING.md).
* relative import paths are no longer officially supported. Everything must now be imported from the ngforage package.
