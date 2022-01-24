import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'asString'})
export class AsStringPipe implements PipeTransform {

  public transform(value: any): string {
    if (value === null) {
      return 'null';
    }

    switch (typeof value) {
      case 'undefined':
        return 'undefined';
      case 'string':
        return value;
      case 'number':
        return value.toString();
      default:
        return JSON.stringify(value, null, 2);
    }
  }
}
