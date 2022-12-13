import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductManagerService } from 'src/app/data/services/administrator/product-manager.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  isLoading = true;
  isSubmitting = false;
  isUpdating = false;
  isDeleting = false;
  histories = [];


  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  form = new FormGroup({
    category: new FormControl('', [ Validators.required ]),
  })
  n(n) {
    return this.form.get(n);
  }


  constructor(
    private productManagerService: ProductManagerService,
  ) { }

  ngOnInit(): void {
    this.allCategory()
  }

  private allCategory(){
    this.productManagerService.getCategory().subscribe(res => {
      if(res){
        this.histories = res.data;
      }
    })
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.productManagerService.addcategory(data).subscribe(res => {
      if(res){
        this.allCategory();
        this.theMessage = "Category added successfully.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.form.reset();
      }
      this.isSubmitting = false;
    })
  }


  removeNotice() {
    setTimeout(() => {
      if (this.showNotice = true) {
        this.showNotice = false;
      }
    }, 5000);
  }

  closeMyNotice() {
    this.showNotice = false;
  }



  returnID;
  deleteCategory(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this category?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.productManagerService.deleteCategory(id).subscribe(res => {
        if (res.data) {
          this.allCategory();
          this.theMessage = "Category successfully deleted.";
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
  }
}
