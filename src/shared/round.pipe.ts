import { Pipe, PipeTransform } from '@angular/core';

/**
 * This is a basic implimenation of a Pipe for rounding numbers. You can see it
 * used on the templates for <note-editor>.
 *
 * https://angular.io/docs/ts/latest/guide/pipes.html
 */
@Pipe({name: 'round'})
export class RoundPipe implements PipeTransform {
  transform(value: number, precision: number = 0): number {
    let factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }
}
