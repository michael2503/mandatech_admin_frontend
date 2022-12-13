import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  {path: 'info/:id', component: UserDetailsComponent},

  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: ':status', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagerRoutingModule { }
