import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { ProjectsComponent } from './components/projects/projects.component';

const routes: Routes = [
  { path: '', component: ProjectsComponent },
  { path: 'add', component: AddProjectComponent },
  { path: 'edit/:id', component: EditProjectComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectManagerRoutingModule { }
