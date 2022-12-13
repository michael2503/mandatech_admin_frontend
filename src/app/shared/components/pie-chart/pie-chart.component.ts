import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, AfterViewInit {
  @Input() totalItems;
  @Input() mainItems;
  @Input() mainItemCol;
  @Input() totalItemCol;

  @ViewChild('svgCont') svgCont: ElementRef;
  totalCircle: HTMLElement;
  mainCircle: HTMLElement;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initiateSvg();
  }

  private initiateSvg() {
    const svgW = +getComputedStyle(this.svgCont.nativeElement).width.replace('px', '');
    this.totalCircle = this.svgCont.nativeElement.querySelector('.total circle');
    this.mainCircle = this.svgCont.nativeElement.querySelector('.mainSvg circle');
    let cx, cy;
    cx = cy = svgW / 2;
    let radius = cx - (0.3 * cx / 2);
    this.totalCircle.style.cssText = `stroke: ${this.totalItemCol}; stroke-width: ${0.3 * cx}px; cx: ${cx}px; cy: ${cy}px; r: ${radius}px`;
    let dashArr = this.calcDashArr(radius);
    this.mainCircle.style.cssText = `stroke: ${this.mainItemCol}; stroke-width: ${0.3 * cx}px; cx: ${cx}px; cy: ${cy}px; r: ${radius}px; stroke-dasharray: 0 ${2 * Math.PI * radius}px`;
    setTimeout(() => {
      this.mainCircle.style.cssText = `stroke: ${this.mainItemCol}; stroke-width: ${0.3 * cx}px; cx: ${cx}px; cy: ${cy}px; r: ${radius}px; stroke-dasharray: ${dashArr.join(' ')}`;
    }, 100);
  }

  private calcDashArr(r) {
    //to degrees
    let actArc = this.mainItems / this.totalItems * 360;
    let mainLen = actArc / 180 * Math.PI * r;
    let remL = (2 * Math.PI * r) - mainLen;
    return [mainLen, remL];
  }

}
