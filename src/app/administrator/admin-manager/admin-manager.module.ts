import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminManagerRoutingModule } from './admin-manager-routing.module';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddAdminComponent } from './components/add-admin/add-admin.component';
import { AdminChangePasswordComponent } from './components/admin-change-password/admin-change-password.component';
import { AdminListingComponent } from './components/admin-listing/admin-listing.component';
import { EditAdminComponent } from './components/edit-admin/edit-admin.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { AdminEditFormSharedComponent } from './components/admin-edit-form-shared/admin-edit-form-shared.component';


@NgModule({
  declarations: [
    AddAdminComponent,
    AdminChangePasswordComponent,
    AdminListingComponent,
    EditAdminComponent,
    ProfileEditComponent,
    AdminEditFormSharedComponent
  ],
  imports: [
    CommonModule,
    AdminManagerRoutingModule,
    AdminSharedModule,
    SharedModule
  ]
})
export class AdminManagerModule { }
