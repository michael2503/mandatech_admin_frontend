import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceManagerRoutingModule } from './service-manager-routing.module';
import { AddServiceComponent } from './components/add-service/add-service.component';
import { ServiceListingComponent } from './components/service-listing/service-listing.component';
import { EditServiceComponent } from './components/edit-service/edit-service.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MainServiceComponent } from './components/main-service/main-service.component';


@NgModule({
  declarations: [
    AddServiceComponent,
    ServiceListingComponent,
    EditServiceComponent,
    MainServiceComponent
  ],
  imports: [
    CommonModule,
    ServiceManagerRoutingModule,
    SharedModule,
    AdminSharedModule,
    AngularEditorModule,
  ]
})
export class ServiceManagerModule { }
