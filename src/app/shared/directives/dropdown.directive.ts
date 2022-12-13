import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('click') onClick() {
    const me = this;
    this.el.nativeElement.nextElementSibling.classList.toggle('dropShow');
    this.el.nativeElement.parentElement.classList.toggle('shown');
    setTimeout(() => {
      document.onclick = auxClick;
    });
    function auxClick(e) {
      const path = e.path || e.composedPath();
      for (let i = 0; i < path.length - 2; i++) {
        if (path[i] == me.el.nativeElement) {
          return;
        }
      }
      me.el.nativeElement.nextElementSibling.classList.remove('dropShow');
      me.el.nativeElement.parentElement.classList.remove('shown');
      document.onclick = null;
    }
  }

}
