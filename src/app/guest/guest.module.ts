import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    GuestRoutingModule,
    SharedModule
  ]
})
export class GuestModule { }
