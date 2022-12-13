import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home-flex-slider',
  templateUrl: './home-flex-slider.component.html',
  styleUrls: ['./home-flex-slider.component.scss']
})
export class HomeFlexSliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselParent') carouselParent: ElementRef;
  flexCont: HTMLElement;
  slideItems: NodeListOf<HTMLElement>;
  imgGridConts: NodeListOf<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.setWinResEv(false);
  }

  ngAfterViewInit() {
    this.flexCont = this.carouselParent.nativeElement.querySelector('.flexCont');
    this.slideItems = this.flexCont.querySelectorAll('.slideItem');
    this.imgGridConts = this.flexCont.querySelectorAll('.imgGridCont');
    this.responsive();
    this.setWinResEv(true);
  }

  private setWinResEv(add) {
    const me = this;
    function resize() {
      me.responsive();
    }
    if (add) {
      window.addEventListener('resize', resize);
    } else {
      window.removeEventListener('resize', resize);
    }
  }

  private responsive() {
    const parW = +getComputedStyle(this.carouselParent.nativeElement).width.replace('px', '');
    if (parW >= 900) {
      this.setItemWidth(4, parW);
    }
  }

  private setItemWidth(no, w) {
    let margR = +getComputedStyle(this.slideItems[0]).marginRight.replace('px', '');
    console.log(margR, w);
    let eachW = (w - ((no - 1) * margR)) / no;
    let totalW = (eachW * no) + (margR * (no - 1));
    this.slideItems.forEach((item, i) => {
      item.style.width = `${eachW}px`;
      this.setGridAspRat(eachW, i);
    });
    this.flexCont.style.width = `${totalW}px`;
  }

  private setGridAspRat(w, i) {
    let finalH = w * 248 / 307.25;
    this.imgGridConts[i].style.height = `${finalH}px`;
  }

}
