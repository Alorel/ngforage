# [6.0.0](https://github.com/Alorel/ngforage/compare/5.0.1...6.0.0) (2020-06-08)


### Documentation

* Add missing tsdoc for some exported members ([](https://github.com/Alorel/ngforage/commit/442be19))
* Removed extraneous import from a readme example ([](https://github.com/Alorel/ngforage/commit/a5619c0))


### Features

* **schematics:** Added support for ng add ([](https://github.com/Alorel/ngforage/commit/f4af048))


### Maintenance

* Add .idea to git ([](https://github.com/Alorel/ngforage/commit/96f654c))
* add missing comma in karma.conf.js ([](https://github.com/Alorel/ngforage/commit/99318f3))
* Recompile for ng9 ([](https://github.com/Alorel/ngforage/commit/652e124))
* Regenerate lockfile ([](https://github.com/Alorel/ngforage/commit/95c8df7)), closes [#226](https://github.com/Alorel/ngforage/issues/226)
* Removed the Omit type as Typescript now bundles its own. ([](https://github.com/Alorel/ngforage/commit/2753a62))


### Refactoring

* Moved an internal property's initialiser. ([](https://github.com/Alorel/ngforage/commit/2486707))
* Refactored an internal toJSON method ([](https://github.com/Alorel/ngforage/commit/e255c02))
* Removed `Symbol.toStringTag` from all classes. ([](https://github.com/Alorel/ngforage/commit/701c7a3))
* Removed NgForageModule ([](https://github.com/Alorel/ngforage/commit/e419759))


### Tests

* Fix "Setting 5 items should increase length to 5" test consistency ([](https://github.com/Alorel/ngforage/commit/3d134de))
* Fix some clearing issues ([](https://github.com/Alorel/ngforage/commit/52e2161))


### BREAKING CHANGES

* library now requires Angular >=9.0.0
* Removed the Omit type as Typescript now bundles its own. ng update will handle this for you
* `Symbol.toStringTag` was removed from call classes in case you were depending on it for any reason.
* NgForageModule has been removed - see MIGRATING.md

## [5.0.1](https://github.com/Alorel/ngforage/compare/5.0.0...5.0.1) (2019-07-10)


### Bug Fixes

* **tests:** Removed "Length should be 0 initially" test as it was no longer needed and would sometimes fail due to changes in the updated Karma lib ([5122181](https://github.com/Alorel/ngforage/commit/5122181))


### Maintenance

* Add .npmrc to .gitignore ([5eba92e](https://github.com/Alorel/ngforage/commit/5eba92e))

# [5.0.0](https://github.com/Alorel/ngforage/compare/4.0.3...5.0.0) (2019-07-10)


### Bug Fixes

* Updated the library for Angular 8 ([5891c12](https://github.com/Alorel/ngforage/commit/5891c12)), closes [#186](https://github.com/Alorel/ngforage/issues/186) [#187](https://github.com/Alorel/ngforage/issues/187) [#188](https://github.com/Alorel/ngforage/issues/188) [#189](https://github.com/Alorel/ngforage/issues/189) [#192](https://github.com/Alorel/ngforage/issues/192)


### Documentation

* Reduce number of badges in README ([a0ba9a2](https://github.com/Alorel/ngforage/commit/a0ba9a2))


### Maintenance

* **deps:** bump handlebars from 4.1.0 to 4.1.2 ([2827125](https://github.com/Alorel/ngforage/commit/2827125))
* **deps:** bump js-yaml from 3.12.2 to 3.13.1 ([7cf2971](https://github.com/Alorel/ngforage/commit/7cf2971))


### BREAKING CHANGES

* The library's Angular dependencies now require versions ^8.0.0.
