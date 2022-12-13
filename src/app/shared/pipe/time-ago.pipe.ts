import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string) {
    let dateDiff = Date.now() - Date.parse(value);
    let timeUnit, count;
    if (dateDiff / 1000 < 60) {
      count = Math.floor(dateDiff / 1000);
      timeUnit = `${count} second${count > 1 ? 's' : ''}`;
    } else if (dateDiff / 1000 >= 60 && dateDiff / 1000 < 60 * 60) {
      count = Math.floor(dateDiff / (1000 * 60));
      timeUnit = `${count} minute${count > 1 ? 's' : ''}`;
    } else if (dateDiff / 1000 >= 60 * 60 && dateDiff / 1000 < 60 * 60 * 24) {
      count = Math.floor(dateDiff / (1000 * 60 * 60));
      timeUnit = `${count} hour${count > 1 ? 's' : ''}`;
    } else if (dateDiff / 1000 >= 60 * 60 * 24 && dateDiff / 1000 < 60 * 60 * 24 * 7) {
      count = Math.floor(dateDiff / (1000 * 60 * 60 * 24));
      timeUnit = `${count} day${count > 1 ? 's' : ''}`;
    } else {
      count = Math.floor(dateDiff / (1000 * 60 * 60 * 24 * 7));
      timeUnit = `${count} week${count > 1 ? 's' : ''}`;
    }
    return `${timeUnit} ago`;
  }

}
