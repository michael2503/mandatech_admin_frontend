import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { UserManagerService } from 'src/app/data/services/administrator/user-manager.service';

@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.scss']
})
export class UserAddressComponent implements OnInit {
  @Input() userAddresses;

  isSubmitting = false;
  closeModal = new BehaviorSubject(false);

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isDeleting = false;

  form = new FormGroup({
    address: new FormControl('', []),
    city: new FormControl('', []),
    state: new FormControl('', []),
    country: new FormControl('', []),
    phone: new FormControl('', []),
    id: new FormControl('', []),
  });

  constructor(
    private userManagerService: UserManagerService
  ) { }

  ngOnInit(): void {
  }


  returnID;
  deleteAddress(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = 'Are you sure you want to this address?';
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.userManagerService.deleteUserAddress(id).subscribe(res => {
        if(res){
          this.userAddresses = res.data;
          this.ngOnInit();
          this.theMessage = "Address successfully deleted";
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
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

  getEdit;
  getEach(id){
    this.getEdit = this.userAddresses.filter(cont => cont.id === parseInt(id))[0];
    this.form.get('address').setValue(this.getEdit.address);
    this.form.get('city').setValue(this.getEdit.city);
    this.form.get('state').setValue(this.getEdit.state);
    this.form.get('country').setValue(this.getEdit.country);
    this.form.get('phone').setValue(this.getEdit.phone);
    this.form.get('id').setValue(this.getEdit.id);
  }

  submit(){
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.userManagerService.updateUserAdd(data).subscribe(res => {
      if(res){
        this.userAddresses = res.data;
        this.closeModal.next(true);
        this.theMessage = "Address successfully updated";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
      }
      this.isSubmitting = false;
    })
  }



}
