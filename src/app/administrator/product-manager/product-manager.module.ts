import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductManagerRoutingModule } from './product-manager-routing.module';
import { CategoryComponent } from './components/category/category.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    CategoryComponent,
    ProductListComponent,
    AddProductComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    ProductManagerRoutingModule,
    AdminSharedModule,
    SharedModule,
    AngularEditorModule,
  ]
})
export class ProductManagerModule { }
