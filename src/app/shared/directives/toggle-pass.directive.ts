import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTogglePass]'
})
export class TogglePassDirective {
  @Input() appTogglePass;
  @Input() toggle: string;

  constructor(
    private el: ElementRef
  ) { }

  @HostListener('click') onClick() {
    if (this.appTogglePass.type == 'text') {
      this.appTogglePass.type = 'password';
      if (this.toggle == 'class') {
        this.el.nativeElement.classList.add('fa-eye');
        this.el.nativeElement.classList.remove('fa-eye-slash');
      } else {
        this.el.nativeElement.innerHTML = "Show";
      }
    } else {
      this.appTogglePass.type = 'text';
      if (this.toggle == 'class') {
        this.el.nativeElement.classList.add('fa-eye-slash');
        this.el.nativeElement.classList.remove('fa-eye');
      } else {
        this.el.nativeElement.innerHTML = "Hide";
      }
    }
  }



}
