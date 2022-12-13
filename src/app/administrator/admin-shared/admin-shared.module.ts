import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminFooterComponent } from './ui/admin-footer/admin-footer.component';
import { AdminHeaderComponent } from './ui/admin-header/admin-header.component';
import { AdminNavContentComponent } from './ui/admin-nav-content/admin-nav-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { AngularEditorModule } from '@kolkov/angular-editor';
// import { NgSelectModule } from '@ng-select/ng-select';
import { AdminSidebarComponent } from './ui/admin-sidebar/admin-sidebar.component';



@NgModule({
  declarations: [
    AdminFooterComponent,
    AdminHeaderComponent,
    AdminNavContentComponent,
    AdminSidebarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    // NgbModule,
    ReactiveFormsModule,
    // AngularEditorModule,
    // NgSelectModule,
    FormsModule,
  ],
  exports: [
    AdminFooterComponent,
    AdminHeaderComponent,
    AdminNavContentComponent,
    ReactiveFormsModule,
    // AngularEditorModule,
    // NgSelectModule,
    FormsModule,
    AdminSidebarComponent
  ]
})
export class AdminSharedModule { }
