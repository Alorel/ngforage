<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [5.0.0](#500)
- [4.0.0](#400)
  - [sessionStorage support](#sessionstorage-support)
  - [Driver name constants have moved](#driver-name-constants-have-moved)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 5.0.0

No migration steps needed

# 4.0.0

## sessionStorage support

sessionStorage support was dropped from ngforage. If you require sessionStorage you can use the
[localforage-driver-session-storage](npmjs.com/package/localforage-driver-session-storage) package
and define the driver in either localforage or ngforage.

## Driver name constants have moved

Driver name constants were previously part of the `NgForageConfig` class. They have now been moved
to their own separate enum:

```typescript
import {Driver, NgForage} from 'ngforage';

class MyService {
  public constructor(ngf: NgForage) {
    ngf.configure({
      driver: [
        Driver.INDEXED_DB,
        Driver.LOCAL_STORAGE
      ]
    })
  }
}
```
