import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ProductManagerService } from 'src/app/data/services/administrator/product-manager.service';
import { ServiceManagerService } from 'src/app/data/services/administrator/service-manager.service';

@Component({
  selector: 'app-main-service',
  templateUrl: './main-service.component.html',
  styleUrls: ['./main-service.component.scss']
})
export class MainServiceComponent implements OnInit {

  isLoading = true;
  isSubmitting = false;
  isUpdating = false;
  isDeleting = false;
  histories = [];


  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  closeModal = new BehaviorSubject(false);

  form = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
  })
  n(n) {
    return this.form.get(n);
  }

  formEdit = new FormGroup({
    id: new FormControl('', [ Validators.required ]),
    name: new FormControl('', [ Validators.required ]),
  })
  eN(eN) {
    return this.form.get(eN);
  }


  constructor(
    private serviceManagerService: ServiceManagerService,
  ) { }

  ngOnInit(): void {
    this.allCategory()
  }

  private allCategory(){
    this.serviceManagerService.listMainService().subscribe(res => {
      if(res){
        this.histories = res.data;
      }
    })
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.serviceManagerService.addMainService(data).subscribe(res => {
      if(res){
        this.allCategory();
        this.theMessage = "Service category added successfully.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.form.reset();
      }
      this.isSubmitting = false;
    })
  }


  submitEdit(){
    if (this.formEdit.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.formEdit.value);
    this.serviceManagerService.updateMainService(data).subscribe(res => {
      if(res){
        this.allCategory();
        this.theMessage = "Service category updated successfully.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.closeModal.next(true);
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




  banInfo;
  getEachBanner(id){
    this.banInfo = this.histories.filter(cont => cont.id === parseInt(id))[0];

    if(this.banInfo){
      this.formEdit.get('id').setValue(this.banInfo.id);
      this.formEdit.get('name').setValue(this.banInfo.name)
    }
  }


}
