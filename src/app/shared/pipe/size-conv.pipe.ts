import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sizeConv'
})
export class SizeConvPipe implements PipeTransform {

  transform(value: any): string {
    if (value < 1024) {
      return `${value}Bytes`;
    } else if (value/1024 < 1024) {
      return `${(value/1024).toFixed(1)}KB`;
    } else if (value/(1024 * 1024)  < 1024) {
      return `${(value/(1024 * 1024)).toFixed(1)}MB`;
    }
    return `${(value/(1024 * 1024 * 1024)).toFixed(1)}GB`;
  }

}
