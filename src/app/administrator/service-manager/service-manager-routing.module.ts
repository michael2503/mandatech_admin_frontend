import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddServiceComponent } from './components/add-service/add-service.component';
import { EditServiceComponent } from './components/edit-service/edit-service.component';
import { MainServiceComponent } from './components/main-service/main-service.component';
import { ServiceListingComponent } from './components/service-listing/service-listing.component';

const routes: Routes = [
  { path: '', component: ServiceListingComponent },
  { path: 'add', component: AddServiceComponent },
  { path: 'edit/:id', component: EditServiceComponent },
  { path: 'category', component: MainServiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceManagerRoutingModule { }
