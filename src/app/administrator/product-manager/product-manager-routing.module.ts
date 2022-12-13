import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductComponent } from './components/add-product/add-product.component';
import { CategoryComponent } from './components/category/category.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ProductListComponent } from './components/product-list/product-list.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'page/:page', component: ProductListComponent },
  { path: 'add', component: AddProductComponent },
  { path: 'edit/:id', component: EditProductComponent },
  { path: 'category', component: CategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductManagerRoutingModule { }
