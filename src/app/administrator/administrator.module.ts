import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminLogoutComponent } from './admin-logout/admin-logout.component';
// import { AdminPasswordComponent } from './admin-password/admin-password.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminSharedModule } from './admin-shared/admin-shared.module';
import { SharedModule } from '../shared/shared.module';
import { AdminAuthGuard } from '../data/services/admin-auth.guard';


@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminLogoutComponent,
    // AdminPasswordComponent
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    HttpClientModule,
    AdminSharedModule,
    SharedModule
  ],
  providers: [
    AdminAuthGuard
  ],
})
export class AdministratorModule { }
