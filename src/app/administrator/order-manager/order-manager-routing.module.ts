import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponsComponent } from './components/coupons/coupons.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductReviewEditComponent } from './components/product-review-edit/product-review-edit.component';
import { ProductReviewComponent } from './components/product-review/product-review.component';

const routes: Routes = [
  { path: '', component: OrdersComponent },
  { path: 'details/:orderNum', component: OrderDetailComponent },

  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: ':status', component: OrdersComponent },

  { path: '', redirectTo: 'coupons/all', pathMatch: 'full' },
  { path: 'coupons/:status', component: CouponsComponent },

  { path: 'reviews/edit/:id', component: ProductReviewEditComponent },
  { path: '', redirectTo: 'reviews/all', pathMatch: 'full' },
  { path: 'reviews/:status', component: ProductReviewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManagerRoutingModule { }
