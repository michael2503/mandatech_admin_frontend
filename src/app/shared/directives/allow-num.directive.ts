import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowNum]'
})
export class AllowNumDirective {

  constructor() { }

  @HostListener('keydown', ['$event']) onKeydown(e) {
    if (isNaN(+e.key)) {
      if (e.key.length < 2) {
        e.preventDefault();
      }
    }
  }

}
