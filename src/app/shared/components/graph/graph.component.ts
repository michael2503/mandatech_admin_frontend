import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewInit, OnDestroy {
  // genPath;
  @ViewChild('path') path: ElementRef;
  @ViewChild('svgEl') svgEl: ElementRef;
  constructor() { }
  groupedArr = [];
  genPoints = [];
  animated = false;
  @Input() yAxis;
  @Input() durationUnit;
  @Input() durationNo;

  ngOnInit(): void {
    this.initiateGrouping();
  }

  private generatePoints(parw, parh) {
    let lowestDate = Date.parse(this.groupedArr[0].date);
    let highestDate = Date.parse(this.groupedArr.slice(-1)[0].date);
    let dateDiff = highestDate - lowestDate;
    let svgW = parw * 0.9;
    let svgH = parh * 0.7;
    let yAxisArr = this.groupedArr.map((each) => each[this.yAxis]);
    let maxYAxis = Math.max(...yAxisArr);
    for (let each of this.groupedArr) {
      let x = svgW * (Date.parse(each.date) - lowestDate) / dateDiff;
      let y = (svgH * each[this.yAxis] / maxYAxis ? maxYAxis : 1) + 8;
      this.genPoints.push([x, y]);
    }
  }

  ngOnDestroy() {
    this.winResEv(false);
  }

  ngAfterViewInit() {
    this.winResEv(true);
    this.responsive();
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
    this.genPoints = [];
    const svgw = +getComputedStyle(this.svgEl.nativeElement).width.replace('px', '');
    const svgh = +getComputedStyle(this.svgEl.nativeElement).height.replace('px', '');
    this.svgEl.nativeElement.setAttribute('viewBox', `0 0 ${svgw} ${svgh}`);
    this.generatePoints(svgw, svgh);
    if (!this.animated) {
      let savedGenPoints = JSON.stringify(this.genPoints);
      let zeropoint = [...this.genPoints];
      for (let pnt of zeropoint) {
        pnt.splice(1, 1, 0);
      }
      let genPath = this.svgPath(zeropoint);
      this.path.nativeElement.setAttribute('d', genPath);
      this.genPoints = JSON.parse(savedGenPoints);
      this.scrollCheck();
    } else {
      this.plotGraph();
    }
  }

  private scrollCheck() {
    const me = this;
    function scroll() {
      let svgBc = me.svgEl.nativeElement.getBoundingClientRect();
      if (svgBc.top >= 0 && svgBc.bottom <= window.innerHeight) {
        me.plotGraph();
        me.animated = true;
        document.body.removeEventListener('scroll', scroll);
      }
    }
    scroll();
    if (!me.animated) {
      document.body.addEventListener('scroll', scroll);
    } else {
      document.body.removeEventListener('scroll', scroll);
    }
  }

  private plotGraph() {
    setTimeout(() => {
      const genPath = this.svgPath(this.genPoints);
      this.path.nativeElement.setAttribute('d', genPath);
    });
  }

  // private animatePath() {
  //   let savedGenPoints = JSON.stringify(this.genPoints);
  //   let zeropoint = [...this.genPoints];
  //   for (let pnt of zeropoint) {
  //     pnt.splice(1, 1, 0);
  //   }
  //   let genPath = this.svgPath(zeropoint);
  //   this.path.nativeElement.setAttribute('d', genPath);
  //   this.genPoints = JSON.parse(savedGenPoints);
  //   setTimeout(() => {
  //     genPath = this.svgPath(this.genPoints);
  //     this.path.nativeElement.setAttribute('d', genPath);
  //     this.animated = true;
  //   }, 1000);
  // }

  // The smoothing ratio
  smoothing = 0.2;

  @Input() rawData;



  points = [
    [5, 10],
    [10, 40],
    [40, 30],
    [60, 5],
    [90, 45],
    [120, 10],
    [150, 45],
    [200, 10]
  ];

  private initiateGrouping() {
    this.groupData(this.rawData);
    for (let i = 0; i < this.groupedArr.length; i++) {
      if (i != 0) {
        let lastDate = this.groupedArr[i - 1].date;
        let currDate = this.groupedArr[i].date;
        let missDate = new Date(Date.parse(lastDate) + (24 * 60 * 60 * 1000));
        let [y, m, d] = [missDate.getFullYear(), missDate.getMonth() + 1, missDate.getDate()];
        if (Date.parse(currDate) - Date.parse(lastDate) > (24 * 60 * 60 * 1000)) {
          this.groupedArr.splice(i, 0, {
            date: `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`,
            data: []
          });
        }
      }
    }
    if (this.groupedArr.length) {
      let dayDiff = Math.floor((Date.now() - Date.parse(this.groupedArr.slice(-1)[0].date)) / (1000 * 60 * 60 * 24));
      for (let i = 0; i < dayDiff; i++) {
        let lastDate = this.groupedArr.slice(-1)[0].date;
        let nextDate = new Date(Date.parse(lastDate) + (24 * 60 * 60 * 1000));
        let [y, m, d] = [nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate()];
        this.groupedArr.push({
          date: `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`,
          data: []
        });
      }
    } else {
      let endDate = new Date();
      let [y, m, d] = [endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate()];
      this.groupedArr.push({
        date: `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`,
        data: []
      });
    }
    let firstDate = Date.parse(this.groupedArr.slice(-1)[0].date) - (29 * 24 * 60 * 60 * 1000);
    let firstDateObj = new Date(firstDate);
    let [fy, fm, fd] = [firstDateObj.getFullYear(), firstDateObj.getMonth() + 1, firstDateObj.getDate()];
    let [iy, im, id] = this.groupedArr[0].date.split('-');
    while (fy != iy || fm != im || fd != id) {
      let insDate = new Date(Date.parse(this.groupedArr[0].date) - (24 * 60 * 60 * 1000));
      let [y, m, d] = [insDate.getFullYear(), insDate.getMonth() + 1, insDate.getDate()];
      this.groupedArr.unshift({
        date: `${y}-${m < 10 ? '0' : ''}${m}-${d < 10 ? '0' : ''}${d}`,
        data: []
      });
      [iy, im, id] = this.groupedArr[0].date.split('-');
    }
    this.groupedArr.forEach((each) => {
      let totalYAxis = 0;
      for (let each2 of each.data) {
        totalYAxis += each2[this.yAxis] ? each2[this.yAxis] : 1;
      }
      each[this.yAxis] = totalYAxis;
    });
    // console.log(this.groupedArr, 'modified');
  }

  private groupData(rawData) {
    for (let i = 0; i < rawData.length; i++) {
      let dateExist;
      if (this.groupedArr.length) {
        dateExist = this.groupedArr.filter((each) => {
          if (this.durationUnit.toLowerCase() == 'day') {
            return each.date == rawData[i].created_at.split(' ')[0];
          }
        });
        dateExist = dateExist.length ? true : false;
      }
      if (!this.groupedArr.length || !dateExist) {
        if (this.durationUnit.toLowerCase() == 'day') {
          this.groupedArr.push({
            date: rawData[i].created_at.split(' ')[0],
            data: rawData.filter((each) => {
              let currTransDate = rawData[i].created_at.split(' ')[0];
              return currTransDate == each.created_at.split(' ')[0];
            })
          });
        }
      }
    }
    this.groupedArr.sort((a, b) => {
      return Date.parse(a.date) - Date.parse(b.date);
    });
    // console.log(this.groupedArr);
  }

  // Properties of a line 
  // I:  - pointA (array) [x,y]: coordinates
  //     - pointB (array) [x,y]: coordinates
  // O:  - (object) { length: l, angle: a }: properties of the line
  private line(pointA, pointB) {
    const lengthX = pointB[0] - pointA[0]
    const lengthY = pointB[1] - pointA[1]
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    }
  }

  // Position of a control point 
  // I:  - current (array) [x, y]: current point coordinates
  //     - previous (array) [x, y]: previous point coordinates
  //     - next (array) [x, y]: next point coordinates
  //     - reverse (boolean, optional): sets the direction
  // O:  - (array) [x,y]: a tuple of coordinates
  private controlPoint(current, previous, next, reverse = false) {

    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist.
    // Replace with 'current'
    const p = previous || current;
    const n = next || current;

    // Properties of the opposed-line
    const o = this.line(p, n);

    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0);
    const length = o.length * this.smoothing;

    // The control point position is relative to the current point
    const x = current[0] + Math.cos(angle) * length;
    const y = current[1] + Math.sin(angle) * length;
    return [x, y];
  }

  // Create the bezier curve command 
  // I:  - point (array) [x,y]: current point coordinates
  //     - i (integer): index of 'point' in the array 'a'
  //     - a (array): complete array of points coordinates
  // O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
  private bezierCommand(point, i, a) {

    // start control point
    const cps = this.controlPoint(a[i - 1], a[i - 2], point)

    // end control point
    const cpe = this.controlPoint(point, a[i - 1], a[i + 1], true)
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
  }

  // Render the svg <path> element 
  // I:  - points (array): points coordinates
  //     - command (function)
  //       I:  - point (array) [x,y]: current point coordinates
  //           - i (integer): index of 'point' in the array 'a'
  //           - a (array): complete array of points coordinates
  //       O:  - (string) a svg path command
  // O:  - (string): a Svg <path> element
  private svgPath(points) {
    // build the d attributes by looping over the points
    const d = points.reduce((acc, point, i, a) => i === 0
      ? `M ${point[0]},${point[1]}`
      : `${acc} ${this.bezierCommand(point, i, a)}`
      , '')
    return `${d}`
  }

}
