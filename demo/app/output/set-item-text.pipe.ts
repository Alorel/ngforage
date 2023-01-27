import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'setItemText',
  standalone: true,
})
export class SetItemTextPipe implements PipeTransform {
  /** @inheritDoc */
  public transform(setItemValue: string, setItemJson: boolean): string {
    return setItemJson ? `JSON.parse('${setItemValue}')` : `'${setItemValue}'`
  }
}
