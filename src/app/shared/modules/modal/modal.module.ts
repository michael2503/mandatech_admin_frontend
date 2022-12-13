import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { OpenModalDirective } from './open-modal.directive';



@NgModule({
  declarations: [
    ModalComponent,
    OpenModalDirective,
  ],
  imports: [
    CommonModule
  ], 
  exports: [
    ModalComponent,
    OpenModalDirective
  ]
})
export class ModalModule { }
