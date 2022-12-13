import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTestimonyComponent } from './components/edit-testimony/edit-testimony.component';
import { PostTestimonyComponent } from './components/post-testimony/post-testimony.component';
import { TestimonyComponent } from './components/testimony/testimony.component';

const routes: Routes = [
  { path: '', component: TestimonyComponent },
  { path: 'page/:page', component: TestimonyComponent },
  { path: 'post', component: PostTestimonyComponent },
  { path: 'edit/:id', component: EditTestimonyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestimonialManagerRoutingModule { }
