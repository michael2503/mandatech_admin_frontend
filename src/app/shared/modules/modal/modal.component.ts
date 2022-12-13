import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modalParent') modalParent: ElementRef;
  closeDiv: HTMLElement;
  closeBtn: HTMLElement;
  @Input() closeModal: BehaviorSubject<boolean>;
  @Input() backClose = true;
  
  @Output() onClose = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const me = this;
    this.closeBtn = this.modalParent.nativeElement.querySelector('.closeBtn');
    this.closeDiv = this.modalParent.nativeElement.querySelector('.closeModal');
    function closeModal() {
      me.modalParent.nativeElement.classList.remove('modalShow');
      me.onClose.emit();
    }
    this.closeModal.subscribe(close => {
      if (close) {
        closeModal();
      }
    });
    if (this.backClose) {
      this.closeBtn.addEventListener('click', closeModal);
      this.closeDiv.addEventListener('click', closeModal);
    }
  }



}
