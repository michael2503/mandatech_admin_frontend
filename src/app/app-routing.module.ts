import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './data/guard/auth.guard';

const routes: Routes = [
  // {
  //   path: '',
  //   loadChildren: () => import(
  //     './guest/guest.module'
  //   ).then(m => m.GuestModule),
  // },
  {
    path: 'user',
    loadChildren: () => import(
      './user/user.module'
    ).then(m => m.UserModule),
    // canLoad: [AuthGuard]
  },

  {
    path: '', loadChildren: () => import(
      './administrator/administrator.module'
    ).then(m => m.AdministratorModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
