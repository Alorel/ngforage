import {Directive} from '@angular/core';

@Directive({
  host: {
    '[class.btn-outline-primary]': 'true',
    '[class.btn-sm]': 'true',
    '[class.btn]': 'true',
    type: 'button'
  },
  selector: 'button[output]',
  standalone: true,
})
export class ButtonStylingDirective {
}
