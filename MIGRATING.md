<!-- START doctoc -->
<!-- END doctoc -->

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
