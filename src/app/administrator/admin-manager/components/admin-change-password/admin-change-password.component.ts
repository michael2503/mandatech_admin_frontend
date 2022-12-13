import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../../../../data/services/config.service';
import { AdminManagerService } from '../../../../data/services/administrator/admin-manager.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { SEOService } from '../../../../data/services/seo.service';

@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.scss']
})
export class AdminChangePasswordComponent implements OnInit {
  isUpdating = false;
  updateError: any;
  adm: any;

  theMessage: any;
  showNotice = false;
  justMssg = false;
  deleteModal = false;

  form = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPass: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    id: new FormControl('', [ ]),
  });

  constructor(
    private configService: ConfigService,
    private adminManagerService: AdminManagerService,
    private adminAuthService: AdminAuthService,
    private seoService: SEOService
  ) { }

  ngOnInit() {
    this.seoUpdate();
    this.updateAuth();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.adm = res;
        this.form.get('id').setValue(this.adm?.id);
      }
    });
  }

  submit() {
    this.isUpdating = true;
    const passOne = this.form.get('password').value;
    const passTwo = this.form.get('confirmPass').value;
    if(passOne != passTwo){
      // alert("Oops, Password not matched");
      // this.updateError = 'Oops, Password not matched';
      this.theMessage = "Oops, Password not matched"
      this.showNotice = true;
      this.justMssg = false;
      this.deleteModal = true;
      this.isUpdating = false;
      return;
    }
    const data = JSON.stringify(this.form.value);
    this.adminManagerService.changePassword(data).subscribe(res => {
      console.log(res);
      if(res){
        if(res.data == 'error'){
          this.theMessage = "Oops! Old password is incorrect";
          this.justMssg = false;
          this.deleteModal = true;
        } else if(res.data = 1){
          this.theMessage = "You have successfully changed your password";
          this.justMssg = true;
          this.deleteModal = false;
          this.form.reset();
        } else {
          this.theMessage = "Oops! Something went wrong, please try it again.";
          this.justMssg = false;
          this.deleteModal = true;
        }
        this.showNotice = true;
      }
      this.isUpdating = false;
    });
  }

  private seoUpdate() {
    this.seoService.updateTitle('Change Password');
    this.seoService.updateDescription('Change Password');
  }

  removeNotice(){
    setTimeout(() => {
      if (this.showNotice = true) {
        this.showNotice = false;
      }
    }, 7000);
  }

  closeMyNotice(){
    this.showNotice = false;
  }

}
