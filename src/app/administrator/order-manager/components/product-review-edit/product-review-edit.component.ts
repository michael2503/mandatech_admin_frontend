import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderManagerService } from 'src/app/data/services/administrator/order-manager.service';

@Component({
  selector: 'app-product-review-edit',
  templateUrl: './product-review-edit.component.html',
  styleUrls: ['./product-review-edit.component.scss']
})
export class ProductReviewEditComponent implements OnInit {
  revID;

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isAdding = false;


  form = new FormGroup({
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    star_rate: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    id: new FormControl('', [Validators.required]),
  })

  review;
  constructor(
    private route: ActivatedRoute,
    private orderManagerService: OrderManagerService
  ) { }

  ngOnInit(): void {
    this.revID = this.route.snapshot.paramMap.get('id');
    this.singlereview()
  }


  private singlereview(){
    this.orderManagerService.singleReview(this.revID).subscribe(res => {
      console.log(res)
      if(res){
        this.review = res.data;
        this.fillAllInputs(this.review);
      }
    })
  }

  private fillAllInputs(res){
    this.form.get('first_name').setValue(res.first_name);
    this.form.get('last_name').setValue(res.last_name);
    this.form.get('email').setValue(res.email);
    this.form.get('star_rate').setValue(res.star_rate);
    this.form.get('comment').setValue(res.comment);
    this.form.get('status').setValue(res.status);
    this.form.get('id').setValue(res.id);
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


  submit(){
    this.isAdding = true;
    const data = JSON.stringify(this.form.value);
    this.orderManagerService.updateReview(data).subscribe(res => {
      if(res){
        this.fillAllInputs(res.data);
        this.theMessage = "Review successfully updated.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
      }
      this.isAdding = false;
    })
  }


}
