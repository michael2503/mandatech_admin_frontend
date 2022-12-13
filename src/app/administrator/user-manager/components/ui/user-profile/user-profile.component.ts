import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserManagerService } from 'src/app/data/services/administrator/user-manager.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Input() customer: any;

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isUpdating = false;

  form = new FormGroup({
    id: new FormControl('', []),
    first_name: new FormControl('', []),
    dob: new FormControl('', []),
    last_name: new FormControl('', []),
    email: new FormControl('', []),
    phone: new FormControl('', []),
    gender: new FormControl('', []),
    password: new FormControl('', []),
  });

  constructor(
    private userManagerService: UserManagerService
  ) { }

  ngOnInit(): void {
    this.fillTheForm();
  }

  private fillTheForm(){
    this.form.get('id').setValue(this.customer.id);
    this.form.get('first_name').setValue(this.customer.first_name);
    this.form.get('dob').setValue(this.customer.dob);
    this.form.get('last_name').setValue(this.customer.last_name);
    this.form.get('email').setValue(this.customer.email);
    this.form.get('phone').setValue(this.customer.phone);
    this.form.get('gender').setValue(this.customer.gender);
  }

  submit(){
    this.isUpdating = true;
    const data = this.form.value;
    this.userManagerService.updateUserInfo(data).subscribe(res => {
      if (res) {
        this.customer = res.data;
        this.theMessage = "User info successfully updated";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
      }
      this.isUpdating = false;
    },
    err => {
      console.log(err);
      if (err.error.error) {
        this.theMessage = err.error.error;
        this.showNotice = true;
        this.justMssg = false;
        this.deleteModal = true;
        this.removeNotice();
      }
      this.isUpdating = false;
    }
  );
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

}
