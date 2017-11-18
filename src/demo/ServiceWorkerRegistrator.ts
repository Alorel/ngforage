import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {StaticConf} from './StaticConf';

let registered = false;

@Injectable()
export class ServiceWorkerRegistrator {

  public constructor(private readonly snack: MatSnackBar) {
  }

  public register() {
    if (!registered) {
      registered = true;
      if ('serviceWorker' in navigator) {
        const sw = navigator.serviceWorker;

        sw.register(StaticConf.SERVICE_WORKER_PATH)
          .then(reg => {
            reg.onupdatefound = () => {
              const inst = reg.installing;

              inst.onstatechange = () => {
                if (inst.state === 'installed') {
                  if (sw.controller) {
                    const snack = this.snack.open(
                      'New or updated content is available!',
                      'Refresh'
                    );
                    const sub   = snack.onAction().subscribe(() => {
                      location.reload();
                      setTimeout(() => {
                        sub.unsubscribe();
                      },         0);
                    });
                  } else {
                    this.snack.open('Demo and documentation now available offline!', null, {
                      duration: <number>StaticConf.SNACK_BAR_DURATION
                    });
                  }
                }
              };
            };
          })
          // tslint:disable-next-line:no-unbound-method
          .catch(console.error);
      }
    }
  }
}
