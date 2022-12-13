import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagerRoutingModule } from './user-manager-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserProfileComponent } from './components/ui/user-profile/user-profile.component';
import { UserAddressComponent } from './components/ui/user-address/user-address.component';
import { UserOrderComponent } from './components/ui/user-order/user-order.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserCouponComponent } from './components/ui/user-coupon/user-coupon.component';


@NgModule({
  declarations: [
    UserListComponent,
    UserDetailsComponent,
    UserProfileComponent,
    UserAddressComponent,
    UserOrderComponent,
    UserCouponComponent
  ],
  imports: [
    CommonModule,
    UserManagerRoutingModule,
    AdminSharedModule,
    SharedModule
  ]
})
export class UserManagerModule { }
