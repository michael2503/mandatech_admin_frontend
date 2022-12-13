import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';

@Component({
  selector: 'app-banner-carousel',
  templateUrl: './banner-carousel.component.html',
  styleUrls: ['./banner-carousel.component.scss']
})
export class BannerCarouselComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('carouselParent') carouselParent: ElementRef;
  flexCont: HTMLElement;
  carouselItems: NodeListOf<HTMLElement>;
  prev: HTMLElement;
  next: HTMLElement;
  carouselIndicators: NodeListOf<HTMLElement>;

  initialSlidePos;
  initialXPos;
  draggingPos;
  slideExt;
  flexW;
  floorExt = 0;
  parW;

  autoSlideVar;

  sliding = false;

  activeInd = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.windowResponsive(false);
  }

  ngAfterViewInit() {
    this.flexCont = this.carouselParent.nativeElement.querySelector('.flexCont');
    this.carouselItems = this.flexCont.querySelectorAll('.carouselItem');
    this.prev = this.carouselParent.nativeElement.querySelector('.carouselCtrlPrev');
    this.next = this.carouselParent.nativeElement.querySelector('.carouselCtrlNext');
    this.carouselIndicators = this.carouselParent.nativeElement.querySelectorAll('.indicatorItem');
    if (isPlatformBrowser(this.platformId)) {
      if (this.carouselItems.length > 1) {
        this.initiateCarousel();
      }
    }
  }

  private windowResponsive(add) {
    const me = this;
    if (add) {
      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', visibilityCheck);
    } else {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibilityCheck);
    }
    function resize() {
      me.responsive();
    }
    function visibilityCheck() {
      document.visibilityState == 'hidden' ? me.stopAutoSlide() : me.startAutoSlide();
    }
  }

  private initiateCarousel() {
    this.carouselItems.forEach((carouselItem) => {
      let cloned = carouselItem.cloneNode(true);
      this.flexCont.appendChild(cloned);
    });
    this.windowResponsive(true);
    this.responsive();
    this.initiateEventBinding();
  }

  private responsive() {
    this.parW = +getComputedStyle(this.carouselParent.nativeElement).width.replace('px', '');
    this.carouselItems = this.flexCont.querySelectorAll('.carouselItem');
    this.carouselItems.forEach((carouselItem) => {
      carouselItem.style.width = `${this.parW}px`;
    });
    this.slideExt = +this.carouselItems[0].style.width.replace('px', '');
    this.flexW = this.carouselItems.length * this.parW;
    this.flexCont.style.width = `${this.flexW}px`;
    this.initialSlidePos = this.parW * this.activeInd * -1;
    this.draggingPos = this.initialSlidePos;
    this.flexCont.style.transition = "0s";
    this.flexCont.style.left = `${this.initialSlidePos}px`;
  }

  private initiateEventBinding() {
    const me = this;
    function slide() {
      me.slide(1);
    }
    function negSlide() {
      me.slide(-1);
    }
    function dragStart(e) {
      me.dragStart(e);
    }
    function indSelect(e, i) {
      me.indicatorSelect(e, i);
    }
    function stopAutoSlide() {
      me.stopAutoSlide()
    }
    function autoSlide() {
      me.startAutoSlide();
    }
    if (this.next) {
      this.next.addEventListener('click', slide);
      this.prev.addEventListener('click', negSlide);
      this.next.addEventListener('touchstart', slide);
      this.prev.addEventListener('touchstart', negSlide);
    }
    this.carouselParent.nativeElement.addEventListener('mousedown', dragStart);
    this.carouselParent.nativeElement.addEventListener('touchstart', dragStart);
    this.carouselParent.nativeElement.addEventListener('mouseenter', stopAutoSlide);
    this.carouselParent.nativeElement.addEventListener('mouseleave', autoSlide);
    this.startAutoSlide();
    if (this.carouselIndicators) {
      this.carouselIndicators.forEach((indicator, i) => {
        indicator.onclick = (e) => { indSelect(e, i) }
        indicator.ontouchstart = (e) => { indSelect(e, i) }
      });
    }
  }

  private startAutoSlide() {
    this.autoSlideVar = setInterval(() => this.slide(1), 5000);
  }

  private stopAutoSlide() {
    clearInterval(this.autoSlideVar);
  }

  private indicatorSelect(e, I) {
    e.stopPropagation();
    if (I == this.activeInd) return;
    this.flexCont.style.transition = "0s";
    this.initialSlidePos = this.parW * this.activeInd * -1;
    this.flexCont.style.left = `${this.initialSlidePos}px`;
    this.activeInd = I;
    this.initialSlidePos = this.parW * this.activeInd * -1;
    this.draggingPos = this.initialSlidePos;
    this.checkIndicators();
    setTimeout(() => {
      this.flexCont.style.transition = "0.6s ease";
      this.flexCont.style.left = `${this.initialSlidePos}px`;
    });
  }

  private slide(n) {
    // e.stopImmediatePropagation();
    // e.stopPropagation();
    // e.preventDefault();
    if (this.sliding) return;
    this.sliding = true;
    let finalPos = +(this.initialSlidePos - (n * this.slideExt));
    let middlePos = (this.flexW / 2 * -1);
    if ((+finalPos.toFixed(0) > 0 && n == -1) || ((+finalPos.toFixed(0) < +(this.slideExt * (this.carouselItems.length - 1) * -1).toFixed(0)) && n == 1)) {
      this.flexCont.style.transition = "0s";
      let resetPos;
      if (finalPos > 0 && n == -1) {
        resetPos = middlePos;
      }
      if (finalPos < (this.slideExt * (this.carouselItems.length - 1)) * -1) {
        resetPos = middlePos + (this.slideExt);
      }
      this.flexCont.style.left = `${resetPos}px`
      finalPos = resetPos - (n * this.slideExt);
    }
    this.initialSlidePos = finalPos;
    this.draggingPos = this.initialSlidePos;
    this.activeInd += n;
    if (this.activeInd > this.carouselItems.length / 2 - 1) {
      this.activeInd = 0;
    }
    if (this.activeInd < 0) {
      this.activeInd = this.carouselItems.length / 2 - 1;
    }
    if (this.carouselIndicators) {
      this.setIndicators();
    }
    setTimeout(() => {
      this.flexCont.style.transition = "0.6s ease";
      this.flexCont.style.left = `${finalPos}px`;
      this.sliding = false;
    }, 10);
  }

  private setIndicators() {
    this.carouselIndicators.forEach((indicator, i) => {
      if (i != this.activeInd) {
        indicator.classList.remove('cusActive');
      } else {
        indicator.classList.add('cusActive');
      }
    });
  }

  private dragStart(e) {
    const me = this;
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    this.carouselParent.nativeElement.style.cursor = "grab";
    this.initialXPos = e.type == "mousedown" ? e.x : e.touches[0].clientX;
    document.onmousemove = drag;
    document.ontouchmove = drag;
    document.onmouseup = dragStop;
    document.ontouchend = dragStop;
    if (e.type == 'touchstart') {
      this.stopAutoSlide();
    }
    function drag(e) {
      me.drag(e);
    }
    function dragStop(e) {
      me.dragStop(e);
    }
  }

  private drag(e) {
    let curXPos = e.type == 'mousemove' ? e.x : e.touches[0].clientX;
    let diff = curXPos - this.initialXPos;
    this.flexCont.style.transition = "0s";
    this.initialXPos = curXPos;
    let middlePos = (this.flexW / 2 * -1);
    let finalPos = this.draggingPos += diff;
    let slideExt;
    if (this.initialSlidePos > this.draggingPos) {
      slideExt = this.initialSlidePos - this.draggingPos;
      if (Math.floor(slideExt / this.slideExt) >= 1 && this.floorExt != Math.floor(slideExt / this.slideExt)) {
        this.activeInd += Math.floor(slideExt / this.slideExt) - this.floorExt;
        this.floorExt = Math.floor(slideExt / this.slideExt);
      }
    } else if (this.initialSlidePos < this.draggingPos) {
      slideExt = this.draggingPos - this.initialSlidePos;
      if (Math.floor(slideExt / this.slideExt) >= 1 && this.floorExt != Math.floor(slideExt / this.slideExt)) {
        this.activeInd -= Math.floor(slideExt / this.slideExt) - this.floorExt;
        this.floorExt = Math.floor(slideExt / this.slideExt);
      }
    }
    if (slideExt) {
      this.checkIndicators();
    }
    if ((finalPos > 0 && diff > 0) || ((finalPos < (this.slideExt * (this.carouselItems.length - 1)) * -1) && diff < 0)) {
      let resetPos;
      if (finalPos > 0 && diff > 0) {
        resetPos = middlePos;
      }
      if ((finalPos < (this.slideExt * (this.carouselItems.length - 1)) * -1) && diff < 0) {
        resetPos = middlePos + (this.slideExt);
      }
      this.flexCont.style.left = `${resetPos}px`
      finalPos = resetPos + diff;
      this.initialSlidePos = resetPos;
      this.floorExt = 0;
    }
    this.draggingPos = finalPos;
    this.flexCont.style.left = `${finalPos}px`;

  }

  private dragStop(e) {
    // e.stopImmediatePropagation();
    // e.stopPropagation();
    // e.preventDefault();
    this.carouselParent.nativeElement.style.cursor = "default";
    document.onmousemove = null;
    document.ontouchmove = null;
    document.onmouseup = null;
    document.ontouchend = null;
    let rawDiff = this.initialSlidePos > this.draggingPos ? (this.initialSlidePos - this.draggingPos) : (this.draggingPos - this.initialSlidePos);
    let realDiff = rawDiff % this.slideExt;
    let slideRem = this.slideExt - realDiff;
    if (this.initialSlidePos > this.draggingPos) {
      let finalPos;
      if (realDiff > 0.2 * this.slideExt) {
        this.flexCont.style.transition = "0.5s ease";
        finalPos = this.draggingPos - slideRem;
        this.activeInd++;
      } else {
        finalPos = this.draggingPos + realDiff;
        this.flexCont.style.transition = "0.3s ease";
      }
      this.flexCont.style.left = `${finalPos}px`;
      this.draggingPos = finalPos;
      this.initialSlidePos = finalPos;
      this.floorExt = 0; //reset floorExt
    } else if (this.initialSlidePos < this.draggingPos) {
      let finalPos;
      if (realDiff > 0.2 * this.slideExt) {
        this.flexCont.style.transition = "0.5s ease";
        finalPos = this.draggingPos + slideRem;
        this.activeInd--;
      } else {
        finalPos = this.draggingPos - realDiff;
        this.flexCont.style.transition = "0.3s ease";
      }
      this.flexCont.style.left = `${finalPos}px`;
      this.draggingPos = finalPos;
      this.initialSlidePos = finalPos;
      this.floorExt = 0; //reset floorExt
    }
    this.checkIndicators();
    if (e.type == 'touchend') {
      this.startAutoSlide();
    }
  }

  private checkIndicators() {
    if (this.activeInd > this.carouselItems.length / 2 - 1) {
      this.activeInd = 0;
    }
    if (this.activeInd < 0) {
      this.activeInd = this.carouselItems.length / 2 - 1;
    }
    if (this.carouselIndicators) {
      this.setIndicators();
    }
  }
}
