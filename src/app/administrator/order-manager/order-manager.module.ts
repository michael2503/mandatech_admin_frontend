import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderManagerRoutingModule } from './order-manager-routing.module';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { ProductReviewComponent } from './components/product-review/product-review.component';
import { ProductReviewEditComponent } from './components/product-review-edit/product-review-edit.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CouponsComponent } from './components/coupons/coupons.component';


@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailComponent,
    ProductReviewComponent,
    ProductReviewEditComponent,
    CouponsComponent
  ],
  imports: [
    CommonModule,
    OrderManagerRoutingModule,
    AdminSharedModule,
    SharedModule
  ]
})
export class OrderManagerModule { }
