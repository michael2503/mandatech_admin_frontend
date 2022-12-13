import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectManagerRoutingModule } from './project-manager-routing.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { AddProjectComponent } from './components/add-project/add-project.component';
import { EditProjectComponent } from './components/edit-project/edit-project.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    ProjectsComponent,
    AddProjectComponent,
    EditProjectComponent
  ],
  imports: [
    CommonModule,
    ProjectManagerRoutingModule,
    AdminSharedModule,
    SharedModule,
    AngularEditorModule,
  ]
})
export class ProjectManagerModule { }
