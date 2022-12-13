import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestimonialManagerRoutingModule } from './testimonial-manager-routing.module';
import { PostTestimonyComponent } from './components/post-testimony/post-testimony.component';
import { TestimonyComponent } from './components/testimony/testimony.component';
import { EditTestimonyComponent } from './components/edit-testimony/edit-testimony.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';


@NgModule({
  declarations: [
    PostTestimonyComponent,
    TestimonyComponent,
    EditTestimonyComponent
  ],
  imports: [
    CommonModule,
    TestimonialManagerRoutingModule,
    SharedModule,
    AdminSharedModule
  ]
})
export class TestimonialManagerModule { }
