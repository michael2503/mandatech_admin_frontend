import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from '../data/services/admin-auth.guard';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminLogoutComponent } from './admin-logout/admin-logout.component';
// import { AdminPasswordComponent } from './admin-password/admin-password.component';

const routes: Routes = [
  { path: '', component: AdminLoginComponent },
  { path: 'login', component: AdminLoginComponent },
  { path: 'logout', component: AdminLogoutComponent },
  // { path: 'forgot-password', component: AdminPasswordComponent },

  {
    path: 'dashboard',
    loadChildren: () => import(
        './admin-dashboard/admin-dashboard.module'
    ).then(mod => mod.AdminDashboardModule),
    canLoad: [AdminAuthGuard]
  },

  {
    path: 'settings-manager',
    loadChildren: () => import(
        './settings-manager/settings-manager.module'
    ).then(mod => mod.SettingsManagerModule),
    canLoad: [AdminAuthGuard]
  },

  {
    path: 'staff-manager',
    loadChildren: () => import(
        './admin-manager/admin-manager.module'
    ).then(mod => mod.AdminManagerModule),
    canLoad: [AdminAuthGuard]
  },

  {
    path: 'content',
    loadChildren: () => import(
        './content-manager/content-manager.module'
    ).then(mod => mod.ContentManagerModule),
    canLoad: [AdminAuthGuard]
  },

  {
    path: 'services',
    loadChildren: () => import(
        './service-manager/service-manager.module'
    ).then(mod => mod.ServiceManagerModule),
    canLoad: [AdminAuthGuard]
  },

  {
    path: 'products',
    loadChildren: () => import(
        './product-manager/product-manager.module'
    ).then(mod => mod.ProductManagerModule),
    canLoad: [AdminAuthGuard]
  },

  {
    path: 'testimonial',
    loadChildren: () => import(
        './testimonial-manager/testimonial-manager.module'
    ).then(mod => mod.TestimonialManagerModule),
    canLoad: [AdminAuthGuard]
  },

  {
    path: 'projects',
    loadChildren: () => import(
        './project-manager/project-manager.module'
    ).then(mod => mod.ProjectManagerModule),
    canLoad: [AdminAuthGuard]
  },

  {
    path: 'order-manager',
    loadChildren: () => import(
        './order-manager/order-manager.module'
    ).then(mod => mod.OrderManagerModule),
    canLoad: [AdminAuthGuard]
  },

  {
    path: 'user-manager',
    loadChildren: () => import(
        './user-manager/user-manager.module'
    ).then(mod => mod.UserManagerModule),
    canLoad: [AdminAuthGuard]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
