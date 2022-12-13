import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-flex-slider',
  templateUrl: './flex-slider.component.html',
  styleUrls: ['./flex-slider.component.scss']
})
export class FlexSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('carouselParent') carouselParent: ElementRef;
  flexCont: HTMLElement;
  slideItems: NodeListOf<HTMLElement>;
  prev: HTMLElement;
  next: HTMLElement;

  @Input() slideResizeConfig;

  draggable = false;

  initialSlidePos = 0;
  draggingPos = 0;
  initialXPos;
  minPos;

  spaceBtwItem;
  slideExt;
  parW;
  flexW;

  dragEvHolder;
  stopDragEvHolder;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.flexCont = this.carouselParent.nativeElement.querySelector('.flexCont');
    this.slideItems = this.flexCont.querySelectorAll('.carouselItem');
    this.next = this.carouselParent.nativeElement.querySelector('.next');
    this.prev = this.carouselParent.nativeElement.querySelector('.prev');
    this.responsive();
    this.winResEv(true);
  }

  private winResEv(add) {
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
    this.parW = +getComputedStyle(this.carouselParent.nativeElement).width.replace('px', '');
    this.spaceBtwItem = +getComputedStyle(this.slideItems[0]).marginRight.replace('px', '');
    let condition = '';
    for (let eachConf of this.slideResizeConfig) {
      if (!eachConf.maxW) {
        condition += `if (this.parW >= ${eachConf.minW}) {
          this.genSlideNo(${eachConf.slideNo});
        }`
      } else if (!eachConf.minW) {
        condition += `if (this.parW < ${eachConf.maxW}) {
          this.genSlideNo(${eachConf.slideNo});
        }`
      } else {
        condition += `if (this.parW >= ${eachConf.minW} && this.parW < ${eachConf.maxW}) {
          this.genSlideNo(${eachConf.slideNo});
        }`
      }
    }
    eval(condition);
  }

  private genSlideNo(no) {
    if (this.slideItems.length > no) {
      this.eventBinding(true);
    } else {
      this.eventBinding(false);
    }
    let eachW = (this.parW - ((no - 1) * this.spaceBtwItem)) / no;
    this.slideItems.forEach((each) => {
      each.style.width = `${eachW}px`;
    });
    this.slideExt = eachW + this.spaceBtwItem;
    this.flexW = this.slideExt * this.slideItems.length;
    this.flexCont.style.width = `${this.flexW}px`;
    this.flexCont.style.left = '0px';
    this.initialSlidePos = 0;
    this.draggingPos = 0;
    this.minPos = (this.flexW - this.spaceBtwItem - this.parW) * -1;
  }

  private eventBinding(bind) {
    if (bind) {
      this.draggable = true;
      this.prev.onclick = () => {
        this.slide(-1);
      }
      this.next.onclick = () => {
        this.slide(1);
      }
    } else {
      this.draggable = false;
      this.prev.onclick = null;
      this.next.onclick = null;
    }
  }

  dragStart(e) {
    const me = this;
    let target = e.target;
    if (target.classList.contains('prev') ||
      target.classList.contains('next') ||
      target.parentElement.classList.contains('prev') ||
      target.parentElement.classList.contains('next')
    ) return;
    e.preventDefault();
    this.carouselParent.nativeElement.style.cursor = "grab";
    this.initialXPos = e.type == 'mousedown' ? e.x : e.touches[0].clientX;
    this.flexCont.style.transition = "0s";
    this.dragEvHolder = drag;
    this.stopDragEvHolder = stopDrag;

    function drag(e) {
      me.drag(e);
    }
    function stopDrag(e) {
      me.dragEnd(e);
    }
    if (e.type == 'mousedown') {
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
    } else {
      document.addEventListener('touchmove', drag);
      document.addEventListener('touchend', stopDrag);
    }
  }

  private drag(e) {
    let currPos = e.type == 'mousemove' ? e.x : e.touches[0].clientX;
    let diff = currPos - this.initialXPos;
    this.initialXPos = currPos;
    let finalPos = this.draggingPos + diff;
    if ((finalPos > 0 && diff > 0) || (this.draggingPos < this.minPos && diff < 0)) {
      finalPos = this.draggingPos + (diff * 0.1);
    }
    this.draggingPos = finalPos;
    this.flexCont.style.left = `${finalPos}px`;
  }

  private dragEnd(e) {
    const me = this;
    if (e.type == 'mouseup') {
      document.removeEventListener('mousemove', me.dragEvHolder);
      document.removeEventListener('mouseup', me.stopDragEvHolder);
    } else {
      document.removeEventListener('touchmove', me.dragEvHolder);
      document.removeEventListener('touchend', me.stopDragEvHolder);
    }
    this.carouselParent.nativeElement.style.cursor = 'default';
    if (this.draggingPos > 0) {
      this.flexCont.style.transition = "0.4s ease";
      this.flexCont.style.left = "0px";
      this.draggingPos = 0;
      this.initialSlidePos = 0;
      return;
    } else if (this.draggingPos < this.minPos) {
      this.flexCont.style.transition = "0.4s ease";
      this.flexCont.style.left = `${this.minPos}px`;
      this.draggingPos = this.minPos;
      this.initialSlidePos = this.minPos;
      return;
    }
    let slideDiff, finalPos;
    this.flexCont.style.transition = '0.6s ease';
    if (this.draggingPos < this.initialSlidePos) {
      slideDiff = (this.initialSlidePos - this.draggingPos) % this.slideExt;
      if (slideDiff > 0.3 * this.slideExt) {
        finalPos = this.draggingPos - (this.slideExt - slideDiff);
      } else {
        this.flexCont.style.transition = '0.4s ease';
        finalPos = this.draggingPos + slideDiff;
      }
    } else if (this.draggingPos > this.initialSlidePos) {
      slideDiff = (this.draggingPos - this.initialSlidePos) % this.slideExt;
      if (slideDiff > 0.3 * this.slideExt) {
        finalPos = this.draggingPos + (this.slideExt - slideDiff);
      } else {
        this.flexCont.style.transition = '0.4s ease';
        finalPos = this.draggingPos - slideDiff;
      }
    }
    if (finalPos) {
      this.flexCont.style.left = `${finalPos}px`;
      this.draggingPos = finalPos;
      this.initialSlidePos = finalPos;
    }
  }

  private slide(n) {
    if ((n == 1 && this.initialSlidePos <= this.minPos) || (n == -1 && this.initialSlidePos >= 0)) return;
    this.flexCont.style.transition = '0.6s ease';
    let finalPos = this.initialSlidePos - (n * this.slideExt);
    this.flexCont.style.left = `${finalPos}px`;
    this.initialSlidePos = finalPos;
    this.draggingPos = finalPos;
  }

}
