import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements OnInit, AfterViewInit, OnDestroy {
  small;
  big;
  divider;
  resEvent;
  isLoading = true;

  days;
  hours;
  minutes;
  seconds;

  sInfo = { left: 0, right: 0, lmax: 6, rmax: 10 }
  mInfo = { left: 0, right: 0, lmax: 6, rmax: 10 }
  hInfo = { left: 0, right: 0, lmax: 3, rmax: 10 }
  dInfo = { left: 0, right: 0, lmax: 10, rmax: 10 }

  sl;
  sr;
  ml;
  mr;
  hl;
  hr;
  dl;
  dr;

  initiated = false;
  calledNg = false;
  visibEv;

  @Input() initWidth = 350;

  intervalVar;

  @Input() countFrom; //= new Date('2020-09-03 13:45:20');

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    let me = this;
    window.removeEventListener('resize', me.resEvent);
    document.removeEventListener('visibilitychange', me.visibEv);
  }

  resizeBound = false;

  ngAfterViewInit() {
    setTimeout(() => {
      let countDown = document.querySelector('.countDown');
      this.small = countDown.querySelectorAll('.small');
      this.big = countDown.querySelectorAll('.big');
      this.divider = countDown.querySelectorAll('.divider');
      this.sl = countDown.querySelector("#sl");
      this.sr = countDown.querySelector("#sr");
      this.ml = countDown.querySelector("#ml");
      this.mr = countDown.querySelector("#mr");
      this.hl = countDown.querySelector("#hl");
      this.hr = countDown.querySelector("#hr");
      this.dl = countDown.querySelector("#dl");
      this.dr = countDown.querySelector("#dr");

      let parwidth = +getComputedStyle(countDown).width.replace('px', '');
      this.responsive(parwidth);
      let me = this;
      
      function visibilityChange(e) {
        switch (document.visibilityState) {
          case 'hidden':
            clearInterval(me.intervalVar);
            break;
          case 'visible':
            me.startInterval();
            break;
        }
      }
      if (!this.resizeBound) {
        this.resEvent = resize;
        this.visibEv = visibilityChange;
        document.addEventListener('visibilitychange', visibilityChange);
        window.addEventListener('resize', resize);
        this.resizeBound = true;
      }
      function resize() {
        let countDown = document.querySelector('.countDown');
        let parwidth = +getComputedStyle(countDown).width.replace('px', '');
        me.responsive(parwidth);
      }
      this.startInterval();
    });
  }

  responsive(pwidth) {
    let bigf = (73 * pwidth) / this.initWidth;
    let smallf = (22 * pwidth) / this.initWidth;
    let bigH = (70 * pwidth) / this.initWidth;
    let spanPad = (14 * pwidth) / this.initWidth;
    let divPad = (2 * pwidth) / this.initWidth;
    let smallLH = (22 * pwidth) / this.initWidth;
    let divF = (45 * pwidth) / this.initWidth;
    for (let i = 0; i < this.small.length; i++) {
      this.small[i.toString()].style.fontSize = `${smallf < 12 ? 12 : smallf}px`;
      this.small[i.toString()].style.lineHeight = `${smallLH < 8 ? 8 : smallLH}px`;
      this.big[i.toString()].style.fontSize = `${bigf}px`;
      this.big[i.toString()].style.height = `${bigH}px`;
      let bspans = this.big[i.toString()].querySelectorAll('span');
      for (let j = 0; j < bspans.length; j++) {
        bspans[j.toString()].style.lineHeight = `${bigH}px`;
        bspans[j.toString()].style.padding = `0 ${spanPad}px`
      }
      if (this.divider[i.toString()] != undefined) {
        this.divider[i.toString()].style.fontSize = `${divF}px`;
        this.divider[i.toString()].style.margin = `0 ${divPad}px`;
      }
    }
  }

  startCount() {
    // let me = this;
    let present = new Date();
    let distance = this.countFrom.getTime() - present.getTime();
    // let actMo = Math.floor(distance/(1000 * 60 * 60 * 24 * 31));
    let actD = Math.floor(distance / (1000 * 60 * 60 * 24));
    let actH = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let actM = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let actS = Math.floor((distance % (1000 * 60)) / (1000));
    this.days = actD;
    this.hours = actH;
    this.minutes = actM;
    this.seconds = actS;

    if (this.days <= 0 && this.hours <= 0 && this.minutes <= 0 && this.seconds <= 0) {
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      clearInterval(this.intervalVar);
      return;
    }

    this.checkDigits();
  }

  checkDigits() {
    let modS, modM, modH, modD;
    if (this.seconds.toString().length < 2) {
      modS = `0${this.seconds}`;
    } else {
      modS = `${this.seconds}`;
    }
    this.sInfo.left = +modS[0];
    this.sInfo.right = +modS[1];

    if (this.minutes.toString().length < 2) {
      modM = `0${this.minutes}`;
    } else {
      modM = `${this.minutes}`;
    }
    this.mInfo.left = +modM[0];
    this.mInfo.right = +modM[1];

    if (this.hours.toString().length < 2) {
      modH = `0${this.hours}`;
    } else {
      modH = `${this.hours}`;
    }
    this.hInfo.left = +modH[0];
    this.hInfo.right = +modH[1];

    if (this.days.toString().length < 2) {
      modD = `0${this.days}`;
    } else {
      modD = `${this.days}`;
    }
    this.dInfo.left = +modD[0];
    this.dInfo.right = +modD[1];
    if (!this.initiated) {
      this.initiateView();
    } else {
      this.updateView();
    }
    this.initiated = true;
  }

  initiateView() {
    // seconds
    this.sr.style.transition = "0s";
    this.sl.style.transition = "0s";
    // seconds right
    if (this.sInfo.right == 0) {
      let rspans = this.sr.querySelectorAll('span');
      for (let i = 0; i < rspans.length; i++) {
        rspans = this.sr.querySelectorAll('span');
        if (i == rspans.length - 1) {
          break;
        }
        let firstSpan = rspans['0'];
        let lastSpan = rspans[(rspans.length - 1).toString()];
        this.sr.insertBefore(lastSpan, firstSpan);
      }
      let setPos = (this.sInfo.rmax - 1) * (-100 / this.sInfo.rmax);
      this.sr.style.transform = `translateY(${setPos}%)`;
    } else {
      let moveTo = this.sInfo.right * (-100 / this.sInfo.rmax);
      this.sr.style.transform = `translateY(${moveTo}%)`;
    }

    // seconds left 
    if (this.sInfo.left == 0) {
      this.prevValueSL = this.sInfo.left;
      let lspans = this.sl.querySelectorAll('span');
      for (let i = 0; i < lspans.length; i++) {
        lspans = this.sl.querySelectorAll('span');
        if (i == lspans.length - 1) {
          break;
        }
        let firstSpan = lspans['0'];
        let lastSpan = lspans[(lspans.length - 1).toString()];
        this.sl.insertBefore(lastSpan, firstSpan);
      }
      let setPos = (this.sInfo.lmax - 1) * (-100 / this.sInfo.lmax);
      this.sl.style.transform = `translateY(${setPos}%)`;
    } else {
      this.prevValueSL = this.sInfo.left;
      let moveTo = this.sInfo.left * (-100 / this.sInfo.lmax);
      this.sl.style.transform = `translateY(${moveTo}%)`;
    }

    // minutes
    this.mr.style.transition = "0s";
    this.ml.style.transition = "0s";
    // minutes right
    if (this.mInfo.right == 0) {
      this.prevValueMR = this.mInfo.right;
      let rspans = this.mr.querySelectorAll('span');
      for (let i = 0; i < rspans.length; i++) {
        rspans = this.mr.querySelectorAll('span');
        if (i == rspans.length - 1) {
          break;
        }
        let firstSpan = rspans['0'];
        let lastSpan = rspans[(rspans.length - 1).toString()];
        this.mr.insertBefore(lastSpan, firstSpan);
      }
      let setPos = (this.mInfo.rmax - 1) * (-100 / this.mInfo.rmax);
      this.mr.style.transform = `translateY(${setPos}%)`;
    } else {
      this.prevValueMR = this.mInfo.right;
      let moveTo = this.mInfo.right * (-100 / this.mInfo.rmax);
      this.mr.style.transform = `translateY(${moveTo}%)`;
    }

    // minutes left 
    if (this.mInfo.left == 0) {
      this.prevValueML = this.mInfo.left;
      let lspans = this.ml.querySelectorAll('span');
      for (let i = 0; i < lspans.length; i++) {
        lspans = this.ml.querySelectorAll('span');
        if (i == lspans.length - 1) {
          break;
        }
        let firstSpan = lspans['0'];
        let lastSpan = lspans[(lspans.length - 1).toString()];
        this.ml.insertBefore(lastSpan, firstSpan);
      }
      let setPos = (this.mInfo.lmax - 1) * (-100 / this.mInfo.lmax);
      this.ml.style.transform = `translateY(${setPos}%)`;
    } else {
      this.prevValueML = this.mInfo.left;
      let moveTo = this.mInfo.left * (-100 / this.mInfo.lmax);
      this.ml.style.transform = `translateY(${moveTo}%)`;
    }

    // hours
    this.hr.style.transition = "0s";
    this.hl.style.transition = "0s";
    // hours right
    if (this.hInfo.right == 0) {
      this.prevValueHR = this.hInfo.right;
      let rspans = this.hr.querySelectorAll('span');
      for (let i = 0; i < rspans.length; i++) {
        rspans = this.hr.querySelectorAll('span');
        if (i == rspans.length - 1) {
          break;
        }
        let firstSpan = rspans['0'];
        let lastSpan = rspans[(rspans.length - 1).toString()];
        this.hr.insertBefore(lastSpan, firstSpan);
      }
      let setPos = (this.hInfo.rmax - 1) * (-100 / this.hInfo.rmax);
      this.hr.style.transform = `translateY(${setPos}%)`;
    } else {
      this.prevValueHR = this.hInfo.right;
      let moveTo = this.hInfo.right * (-100 / this.hInfo.rmax);
      this.hr.style.transform = `translateY(${moveTo}%)`;
    }

    // hours left 
    if (this.hInfo.left == 0) {
      this.prevValueHL = this.hInfo.left;
      let lspans = this.hl.querySelectorAll('span');
      for (let i = 0; i < lspans.length; i++) {
        lspans = this.hl.querySelectorAll('span');
        if (i == lspans.length - 1) {
          break;
        }
        let firstSpan = lspans['0'];
        let lastSpan = lspans[(lspans.length - 1).toString()];
        this.hl.insertBefore(lastSpan, firstSpan);
      }
      let setPos = (this.hInfo.lmax - 1) * (-100 / this.hInfo.lmax);
      this.hl.style.transform = `translateY(${setPos}%)`;
    } else {
      this.prevValueHL = this.hInfo.left;
      let moveTo = this.hInfo.left * (-100 / this.hInfo.lmax);
      this.hl.style.transform = `translateY(${moveTo}%)`;
    }

    // days
    this.dr.style.transition = "0s";
    this.dl.style.transition = "0s";
    // days right
    if (this.dInfo.right == 0) {
      this.prevValueDR = this.hInfo.right;
      let rspans = this.dr.querySelectorAll('span');
      for (let i = 0; i < rspans.length; i++) {
        rspans = this.dr.querySelectorAll('span');
        if (i == rspans.length - 1) {
          break;
        }
        let firstSpan = rspans['0'];
        let lastSpan = rspans[(rspans.length - 1).toString()];
        this.dr.insertBefore(lastSpan, firstSpan);
      }
      let setPos = (this.dInfo.rmax - 1) * (-100 / this.dInfo.rmax);
      this.dr.style.transform = `translateY(${setPos}%)`;
    } else {
      this.prevValueDR = this.hInfo.right;
      let moveTo = this.dInfo.right * (-100 / this.dInfo.rmax);
      this.dr.style.transform = `translateY(${moveTo}%)`;
    }

    // days left 
    if (this.dInfo.left == 0) {
      this.prevValueDL = this.hInfo.left;
      let lspans = this.dl.querySelectorAll('span');
      for (let i = 0; i < lspans.length; i++) {
        lspans = this.dl.querySelectorAll('span');
        if (i == lspans.length - 1) {
          break;
        }
        let firstSpan = lspans['0'];
        let lastSpan = lspans[(lspans.length - 1).toString()];
        this.dl.insertBefore(lastSpan, firstSpan);
      }
      let setPos = (this.dInfo.lmax - 1) * (-100 / this.dInfo.lmax);
      this.dl.style.transform = `translateY(${setPos}%)`;
    } else {
      this.prevValueDL = this.hInfo.left;
      let moveTo = this.dInfo.left * (-100 / this.dInfo.lmax);
      this.dl.style.transform = `translateY(${moveTo}%)`;
    }

  }

  prevValueSL;

  prevValueMR;
  prevValueML;

  prevValueHL;
  prevValueHR;

  prevValueDL;
  prevValueDR;


  updateView() {
    // seconds 
    const me = this;
    this.sr.style.transition = "transform 0.5s ease-out";
    this.sl.style.transition = "transform 0.5s ease-out";

    this.mr.style.transition = "transform 0.5s ease-out";
    this.ml.style.transition = "transform 0.5s ease-out";

    this.hr.style.transition = "transform 0.5s ease-out";
    this.hl.style.transition = "transform 0.5s ease-out";

    this.dr.style.transition = "transform 0.5s ease-out";
    this.dl.style.transition = "transform 0.5s ease-out";

    // seconds
    this.updateSecR();
    this.updateSecL();

    // minutes 
    this.updateMinR();
    this.updateMinL();

    // hours 
    this.updateHR();
    this.updateHL();

    // days 
    this.updateDR();
    this.updateDL();

  }

  rearrangeNumFunc;
  resetPosFunc;

  updateSecL() {
    const me = this;

    let spans = this.sl.querySelectorAll('span');
    if (spans[(spans.length - 1).toString()].innerHTML == 0 && this.sInfo.left != 0) {
      this.sl.style.transition = "transform 0.5s ease-out";
      this.prevValueSL = this.sInfo.left;
      let setPos = (this.sInfo.left - 1) * (-100 / this.sInfo.lmax);
      this.sl.addEventListener('transitionend', rearrangeNum);
      this.sl.style.transform = `translateY(${setPos}%)`;
      return;
    }

    function rearrangeNum() {
      let spans = me.sl.querySelectorAll('span');
      me.sl.style.transition = "0s";
      let lastSpan = spans[(spans.length - 1).toString()];
      let firstSpan = spans['0'];
      me.sl.insertBefore(lastSpan, firstSpan);
      let finalPos = me.sInfo.left * (-100 / me.sInfo.lmax);
      me.sl.style.transform = `translateY(${finalPos}%)`;
      me.sl.removeEventListener('transitionend', rearrangeNum);
    }

    function resetPos() {
      me.sl.style.transition = "0s";
      let spans = me.sl.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        spans = me.sl.querySelectorAll('span');
        if (i == (spans.length - 1)) {
          break;
        }
        let firstSpan = spans['0'];
        let lastSpan = spans[(spans.length - 1).toString()];
        me.sl.insertBefore(lastSpan, firstSpan);
      }
      let finalPos = (me.sInfo.lmax - 1) * (-100 / me.sInfo.lmax);
      me.sl.style.transform = `translateY(${finalPos}%)`;
      me.sl.removeEventListener('transitionend', resetPos);
    }

    let setPos = this.sInfo.left * (-100 / this.sInfo.lmax);
    if (this.prevValueSL != this.sInfo.left) {
      if (this.sInfo.left == 0) {
        this.prevValueSL = this.sInfo.left;
        this.sl.addEventListener('transitionend', resetPos);
      }
    }
    if (spans[(spans.length - 1).toString()].innerHTML != 0) {
      this.sl.style.transform = `translateY(${setPos}%)`;
    }
    this.prevValueSL = this.sInfo.left;
  }

  updateSecR() {
    const me = this;
    let spans = this.sr.querySelectorAll('span');
    if (spans[(spans.length - 1).toString()].innerHTML == 0) {
      this.sr.style.transition = "transform 0.5s ease-out";
      let setPos = (this.sInfo.right - 1) * (-100 / this.sInfo.rmax);
      this.sr.addEventListener('transitionend', rearrangeNum);
      this.sr.style.transform = `translateY(${setPos}%)`;
      return;
    }

    function rearrangeNum() {
      let spans = me.sr.querySelectorAll('span');
      me.sr.style.transition = "0s";
      let lastSpan = spans[(spans.length - 1).toString()];
      let firstSpan = spans['0'];
      me.sr.insertBefore(lastSpan, firstSpan);
      let finalPos = me.sInfo.right * (-100 / me.sInfo.rmax);
      me.sr.style.transform = `translateY(${finalPos}%)`;
      me.sr.removeEventListener('transitionend', rearrangeNum);
    }

    function resetPos() {
      me.sr.style.transition = "0s";
      let spans = me.sr.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        spans = me.sr.querySelectorAll('span');
        if (i == (spans.length - 1)) {
          break;
        }
        let firstSpan = spans['0'];
        let lastSpan = spans[(spans.length - 1).toString()];
        me.sr.insertBefore(lastSpan, firstSpan);
      }
      let finalPos = (me.sInfo.rmax - 1) * (-100 / me.sInfo.rmax);
      me.sr.style.transform = `translateY(${finalPos}%)`;
      me.sr.removeEventListener('transitionend', resetPos);
    }

    let setPos = this.sInfo.right * (-100 / this.sInfo.rmax);
    if (this.sInfo.right == 0) {
      this.sr.addEventListener('transitionend', resetPos);
    }
    this.sr.style.transform = `translateY(${setPos}%)`;
  }

  updateMinR() {
    const me = this;
    let spans = this.mr.querySelectorAll('span');
    if (spans[(spans.length - 1).toString()].innerHTML == 0 && this.mInfo.right != 0) {
      this.mr.style.transition = "transform 0.5s ease-out";
      this.prevValueMR = this.mInfo.right;
      let setPos = (this.mInfo.right - 1) * (-100 / this.mInfo.rmax);
      this.mr.addEventListener('transitionend', rearrangeNum);
      this.mr.style.transform = `translateY(${setPos}%)`;
      return;
    }

    function rearrangeNum() {
      let spans = me.mr.querySelectorAll('span');
      me.mr.style.transition = "0s";
      let lastSpan = spans[(spans.length - 1).toString()];
      let firstSpan = spans['0'];
      me.mr.insertBefore(lastSpan, firstSpan);
      let finalPos = me.mInfo.right * (-100 / me.mInfo.rmax);
      me.mr.style.transform = `translateY(${finalPos}%)`;
      me.mr.removeEventListener('transitionend', rearrangeNum);
    }

    function resetPos() {
      me.mr.style.transition = "0s";
      let spans = me.mr.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        spans = me.mr.querySelectorAll('span');
        if (i == (spans.length - 1)) {
          break;
        }
        let firstSpan = spans['0'];
        let lastSpan = spans[(spans.length - 1).toString()];
        me.mr.insertBefore(lastSpan, firstSpan);
      }
      let finalPos = (me.mInfo.rmax - 1) * (-100 / me.mInfo.rmax);
      me.mr.style.transform = `translateY(${finalPos}%)`;
      me.mr.removeEventListener('transitionend', resetPos);
    }

    let setPos = this.mInfo.right * (-100 / this.mInfo.rmax);
    if (this.prevValueMR != this.mInfo.right) {
      if (this.mInfo.right == 0) {
        this.prevValueMR = this.mInfo.right;
        this.mr.addEventListener('transitionend', resetPos);
      }
    }
    if (spans[(spans.length - 1).toString()].innerHTML != 0) {
      this.mr.style.transform = `translateY(${setPos}%)`;
    }
    this.prevValueMR = this.mInfo.right;
  }

  updateMinL() {
    const me = this;

    let spans = this.ml.querySelectorAll('span');
    if (spans[(spans.length - 1).toString()].innerHTML == 0 && this.mInfo.left != 0) {
      this.ml.style.transition = "transform 0.5s ease-out";
      this.prevValueML = this.mInfo.left;
      let setPos = (this.mInfo.left - 1) * (-100 / this.mInfo.lmax);
      this.ml.addEventListener('transitionend', rearrangeNum);
      this.ml.style.transform = `translateY(${setPos}%)`;
      return;
    }

    function rearrangeNum() {
      let spans = me.ml.querySelectorAll('span');
      me.ml.style.transition = "0s";
      let lastSpan = spans[(spans.length - 1).toString()];
      let firstSpan = spans['0'];
      me.ml.insertBefore(lastSpan, firstSpan);
      let finalPos = me.mInfo.left * (-100 / me.mInfo.lmax);
      me.ml.style.transform = `translateY(${finalPos}%)`;
      me.ml.removeEventListener('transitionend', rearrangeNum);
    }

    function resetPos() {
      me.ml.style.transition = "0s";
      let spans = me.ml.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        spans = me.ml.querySelectorAll('span');
        if (i == (spans.length - 1)) {
          break;
        }
        let firstSpan = spans['0'];
        let lastSpan = spans[(spans.length - 1).toString()];
        me.ml.insertBefore(lastSpan, firstSpan);
      }
      let finalPos = (me.mInfo.lmax - 1) * (-100 / me.mInfo.lmax);
      me.ml.style.transform = `translateY(${finalPos}%)`;
      me.ml.removeEventListener('transitionend', resetPos);
    }

    let setPos = this.mInfo.left * (-100 / this.mInfo.lmax);
    if (this.prevValueML != this.mInfo.left) {
      if (this.mInfo.left == 0) {
        this.prevValueML = this.mInfo.left;
        this.ml.addEventListener('transitionend', resetPos);
      }
    }
    if (spans[(spans.length - 1).toString()].innerHTML != 0) {
      this.ml.style.transform = `translateY(${setPos}%)`;
    }
    this.prevValueML = this.mInfo.left;
  }

  updateHR() {
    const me = this;
    let spans = this.hr.querySelectorAll('span');
    if (spans[(spans.length - 1).toString()].innerHTML == 0 && this.hInfo.right != 0) {
      this.hr.style.transition = "transform 0.5s ease-out";
      this.prevValueHR = this.hInfo.right;
      let setPos = (this.hInfo.right - 1) * (-100 / this.hInfo.rmax);
      this.hr.addEventListener('transitionend', rearrangeNum);
      this.hr.style.transform = `translateY(${setPos}%)`;
      return;
    }

    function rearrangeNum() {
      let spans = me.hr.querySelectorAll('span');
      me.hr.style.transition = "0s";
      let lastSpan = spans[(spans.length - 1).toString()];
      let firstSpan = spans['0'];
      me.hr.insertBefore(lastSpan, firstSpan);
      let finalPos = me.hInfo.right * (-100 / me.hInfo.rmax);
      me.hr.style.transform = `translateY(${finalPos}%)`;
      me.hr.removeEventListener('transitionend', rearrangeNum);
    }

    function resetPos() {
      me.hr.style.transition = "0s";
      let spans = me.hr.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        spans = me.hr.querySelectorAll('span');
        if (i == (spans.length - 1)) {
          break;
        }
        let firstSpan = spans['0'];
        let lastSpan = spans[(spans.length - 1).toString()];
        me.hr.insertBefore(lastSpan, firstSpan);
      }
      let finalPos = (me.hInfo.rmax - 1) * (-100 / me.hInfo.rmax);
      me.hr.style.transform = `translateY(${finalPos}%)`;
      me.hr.removeEventListener('transitionend', resetPos);
    }

    let setPos = this.hInfo.right * (-100 / this.hInfo.rmax);
    if (this.prevValueHR != this.hInfo.right) {
      if (this.hInfo.right == 0) {
        this.prevValueHR = this.hInfo.right;
        this.hr.addEventListener('transitionend', resetPos);
      }
    }
    if (spans[(spans.length - 1).toString()].innerHTML != 0) {
      this.hr.style.transform = `translateY(${setPos}%)`;
    }
    this.prevValueHR = this.hInfo.right;
  }

  updateHL() {
    const me = this;

    let spans = this.hl.querySelectorAll('span');
    if (spans[(spans.length - 1).toString()].innerHTML == 0 && this.hInfo.left != 0) {
      this.hl.style.transition = "transform 0.5s ease-out";
      this.prevValueHL = this.hInfo.left;
      let setPos = (this.hInfo.left - 1) * (-100 / this.hInfo.lmax);
      this.hl.addEventListener('transitionend', rearrangeNum);
      this.hl.style.transform = `translateY(${setPos}%)`;
      return;
    }

    function rearrangeNum() {
      let spans = me.hl.querySelectorAll('span');
      me.hl.style.transition = "0s";
      let lastSpan = spans[(spans.length - 1).toString()];
      let firstSpan = spans['0'];
      me.hl.insertBefore(lastSpan, firstSpan);
      let finalPos = me.hInfo.left * (-100 / me.hInfo.lmax);
      me.hl.style.transform = `translateY(${finalPos}%)`;
      me.hl.removeEventListener('transitionend', rearrangeNum);
    }

    function resetPos() {
      me.hl.style.transition = "0s";
      let spans = me.hl.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        spans = me.hl.querySelectorAll('span');
        if (i == (spans.length - 1)) {
          break;
        }
        let firstSpan = spans['0'];
        let lastSpan = spans[(spans.length - 1).toString()];
        me.hl.insertBefore(lastSpan, firstSpan);
      }
      let finalPos = (me.hInfo.lmax - 1) * (-100 / me.hInfo.lmax);
      me.hl.style.transform = `translateY(${finalPos}%)`;
      me.hl.removeEventListener('transitionend', resetPos);
    }

    let setPos = this.hInfo.left * (-100 / this.hInfo.lmax);
    if (this.prevValueHL != this.hInfo.left) {
      if (this.hInfo.left == 0) {
        this.prevValueHL = this.hInfo.left;
        this.hl.addEventListener('transitionend', resetPos);
      }
    }
    if (spans[(spans.length - 1).toString()].innerHTML != 0) {
      this.hl.style.transform = `translateY(${setPos}%)`;
    }
    this.prevValueHL = this.hInfo.left;
  }

  updateDR() {
    const me = this;
    let spans = this.dr.querySelectorAll('span');
    if (spans[(spans.length - 1).toString()].innerHTML == 0 && this.dInfo.right != 0) {
      this.dr.style.transition = "transform 0.5s ease-out";
      this.prevValueDR = this.dInfo.right;
      let setPos = (this.dInfo.right - 1) * (-100 / this.dInfo.rmax);
      this.dr.addEventListener('transitionend', rearrangeNum);
      this.dr.style.transform = `translateY(${setPos}%)`;
      return;
    }

    function rearrangeNum() {
      let spans = me.dr.querySelectorAll('span');
      me.dr.style.transition = "0s";
      let lastSpan = spans[(spans.length - 1).toString()];
      let firstSpan = spans['0'];
      me.dr.insertBefore(lastSpan, firstSpan);
      let finalPos = me.dInfo.right * (-100 / me.dInfo.rmax);
      me.dr.style.transform = `translateY(${finalPos}%)`;
      me.dr.removeEventListener('transitionend', rearrangeNum);
    }

    function resetPos() {
      me.dr.style.transition = "0s";
      let spans = me.dr.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        spans = me.dr.querySelectorAll('span');
        if (i == (spans.length - 1)) {
          break;
        }
        let firstSpan = spans['0'];
        let lastSpan = spans[(spans.length - 1).toString()];
        me.dr.insertBefore(lastSpan, firstSpan);
      }
      let finalPos = (me.dInfo.rmax - 1) * (-100 / me.dInfo.rmax);
      me.dr.style.transform = `translateY(${finalPos}%)`;
      me.dr.removeEventListener('transitionend', resetPos);
    }

    let setPos = this.dInfo.right * (-100 / this.dInfo.rmax);
    if (this.prevValueDR != this.dInfo.right) {
      if (this.dInfo.right == 0) {
        this.prevValueDR = this.dInfo.right;
        this.dr.addEventListener('transitionend', resetPos);
      }
    }
    if (spans[(spans.length - 1).toString()].innerHTML != 0) {
      this.dr.style.transform = `translateY(${setPos}%)`;
    }
    this.prevValueDR = this.dInfo.right;
  }

  updateDL() {
    const me = this;

    let spans = this.dl.querySelectorAll('span');
    if (spans[(spans.length - 1).toString()].innerHTML == 0 && this.dInfo.left != 0) {
      this.dl.style.transition = "transform 0.5s ease-out";
      this.prevValueDL = this.dInfo.left;
      let setPos = (this.dInfo.left - 1) * (-100 / this.dInfo.lmax);
      this.dl.addEventListener('transitionend', rearrangeNum);
      this.dl.style.transform = `translateY(${setPos}%)`;
      return;
    }

    function rearrangeNum() {
      let spans = me.dl.querySelectorAll('span');
      me.dl.style.transition = "0s";
      let lastSpan = spans[(spans.length - 1).toString()];
      let firstSpan = spans['0'];
      me.dl.insertBefore(lastSpan, firstSpan);
      let finalPos = me.dInfo.left * (-100 / me.dInfo.lmax);
      me.dl.style.transform = `translateY(${finalPos}%)`;
      me.dl.removeEventListener('transitionend', rearrangeNum);
    }

    function resetPos() {
      me.dl.style.transition = "0s";
      let spans = me.dl.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        spans = me.dl.querySelectorAll('span');
        if (i == (spans.length - 1)) {
          break;
        }
        let firstSpan = spans['0'];
        let lastSpan = spans[(spans.length - 1).toString()];
        me.dl.insertBefore(lastSpan, firstSpan);
      }
      let finalPos = (me.dInfo.lmax - 1) * (-100 / me.dInfo.lmax);
      me.dl.style.transform = `translateY(${finalPos}%)`;
      me.dl.removeEventListener('transitionend', resetPos);
    }

    let setPos = this.dInfo.left * (-100 / this.dInfo.lmax);
    if (this.prevValueDL != this.dInfo.left) {
      if (this.dInfo.left == 0) {
        this.prevValueDL = this.dInfo.left;
        this.dl.addEventListener('transitionend', resetPos);
      }
    }
    if (spans[(spans.length - 1).toString()].innerHTML != 0) {
      this.dl.style.transform = `translateY(${setPos}%)`;
    }
    this.prevValueDL = this.dInfo.left;
  }


  get stopTimer() {
    if (this.days <= 0 && this.hours <= 0 && this.minutes <= 0 && this.seconds <= 0) {
      if (!this.calledNg) {
        // this.isLoading = true;
        setTimeout(() => {
          this.ngAfterViewInit();
        }, 500);
        this.calledNg = true;
      }
      return true;
    }
    return false;
  }

  startInterval() {
    let me = this;
    this.intervalVar = setInterval(start, 1000);
    function start() {
      me.startCount();
    }
  }

}
