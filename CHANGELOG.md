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


### BREAKING CHANGES

* sessionStorage is no longer supported by default. If you need sessionStorage support you can use the [localforage-driver-session-storage](https://npmjs.com/package/localforage-driver-session-storage) package.
* Driver names are now accessed via `import {Driver} from 'ngforage'`. See [migration notes](https://github.com/Alorel/ngforage/blob/4.0.0/MIGRATING.md).
* relative import paths are no longer officially supported. Everything must now be imported from the ngforage package.

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


### BREAKING CHANGES

* sessionStorage is no longer supported by default. If you need sessionStorage support you can use the [localforage-driver-session-storage](https://npmjs.com/package/localforage-driver-session-storage) package.
* Driver names are now accessed via `import {Driver} from 'ngforage'`. See [migration notes](https://github.com/Alorel/ngforage/blob/4.0.0/MIGRATING.md).
* relative import paths are no longer officially supported. Everything must now be imported from the ngforage package.
