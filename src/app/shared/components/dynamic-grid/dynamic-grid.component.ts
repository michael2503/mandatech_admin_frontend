import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.scss']
})
export class DynamicGridComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() images;
  @ViewChild('gridCont') gridCont: ElementRef;
  gridItems: NodeListOf<HTMLElement>;
  startInd = 0;
  resizedDimensions = [];
  minH = 150;
  maxH = 400;
  prevNoGrid;

  initialData;

  get checkChange() {
    if (this.initialData != JSON.stringify(this.images)) {
      this.resizedDimensions = [];
      this.windowEventCtrl(false);
      this.ngAfterViewInit();
      this.initialData = JSON.stringify(this.images);
    }
    return '';
  }

  constructor() { }

  ngOnInit(): void {
    this.initialData = JSON.stringify(this.images);
  }

  ngAfterViewInit() {
    this.gridItems = this.gridCont.nativeElement.querySelectorAll('.gridItem');
    this.responsive();
    this.windowEventCtrl(true);
  }

  ngOnDestroy() {
    this.windowEventCtrl(false);
  }

  private windowEventCtrl(add) {
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
    const parW = +getComputedStyle(this.gridCont.nativeElement).width.replace('px', '');
    this.resizedDimensions = [];
    this.startInd = 0;
    this.autoSizeItems(parW);
  }

  private autoSizeItems(parW, noGrid = 4) {
    let actW = parW - (noGrid * 10);
    let remainder = this.images.length - this.resizedDimensions.length;
    if (remainder > (noGrid - 1)) {
      let avgH = this.calcAvgHeight(noGrid);
      let wArr = this.calcMatchWEach(noGrid, avgH);
      let totalW = eval(wArr.join('+'));
      let totalH = actW * (avgH * noGrid) / totalW;
      let finalH = totalH / noGrid;
      if (finalH < this.minH) {
        if (noGrid == 1) {
          this.finalCalc(actW, avgH, noGrid, totalW);
          if (this.resizedDimensions.length < this.images.length) {
            this.startInd += noGrid;
            this.prevNoGrid = noGrid;
            noGrid = 4;
            this.autoSizeItems(parW, noGrid);
          }
        } else {
          this.autoSizeItems(parW, (noGrid - 1));
        }
      } else if (finalH > this.maxH) {
        if (noGrid == remainder || noGrid == 1) {
          this.finalCalc(actW, avgH, noGrid, totalW);
          if (this.resizedDimensions.length < this.images.length) {
            this.startInd += noGrid;
            this.prevNoGrid = noGrid;
            noGrid = 4;
            this.autoSizeItems(parW, noGrid);
          }
        } else {
          this.autoSizeItems(parW, (noGrid + 1));
        }
      } else {
        this.finalCalc(actW, avgH, noGrid, totalW);
        if (this.resizedDimensions.length < this.images.length) {
          this.startInd += noGrid;
          this.prevNoGrid = noGrid;
          noGrid = 4;
          this.autoSizeItems(parW, noGrid);
        }
      }
    } else {
      if (this.prevNoGrid - remainder < 2 || parW < 400) {
        this.autoSizeItems(parW, remainder);
      } else {
        if (this.resizedDimensions.length) {
          let prevRowH = this.resizedDimensions[this.resizedDimensions.length - 1].height;
          let finalWArr = [];
          let remLen = this.images.length - this.resizedDimensions.length;
          for (let i = this.startInd; i < (this.startInd + remLen); i++) {
            let finalW = prevRowH * this.images[i].width / this.images[i].height;
            finalWArr.push(finalW);
          }
          for (let eachw of finalWArr) {
            this.resizedDimensions.push({ width: eachw, height: prevRowH });
          }
        }
      }
    }
    this.setGridDimensions();
  }

  private finalCalc(actW, avgH, noGrid, totalW) {
    let totalH = actW * (avgH * noGrid) / totalW;
    let finalH = totalH / noGrid;
    let finalWArr = this.calcMatchWEach(noGrid, finalH);
    let newTotalW = eval(finalWArr.join('+'));
    finalWArr.forEach(eachW => {
      this.resizedDimensions.push({ width: eachW, height: finalH });
    });
  }

  private setGridDimensions() {
    this.resizedDimensions.forEach((eachDim, i) => {
      this.gridItems[i].style.cssText = `width: ${eachDim.width}px; height: ${eachDim.height}px`;
    });
  }

  private calcMatchWEach(no, h) {
    let arrW = [];
    for (let i = this.startInd; i < (this.startInd + no); i++) {
      let matchW = this.images[i].width * h / this.images[i].height;
      arrW.push(matchW);
    }
    return arrW;
  }

  private calcAvgHeight(no) {
    let totalH = 0;
    for (let i = this.startInd; i < (this.startInd + no); i++) {
      totalH += this.images[i].height;
    }
    return totalH / no;
  }

}
