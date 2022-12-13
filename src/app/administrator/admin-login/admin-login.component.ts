import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SEOService } from 'src/app/data/services/seo.service';
import { AdminAuthService } from '../../data/services/admin-auth.service';
import { ConfigService } from '../../data/services/config.service';
// import { SEOService } from '../../data/services/seo.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  isLoading = false;

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  authError: any;
  projectName: string;
  settings: any;

  form = new FormGroup({
    admin: new FormControl('', [
      Validators.minLength(4),
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  });
  n(n){
    return this.form.get(n);
  }

  constructor(
    private adminAuthService: AdminAuthService,
    private configService: ConfigService,
    private router: Router,
    private generalSettingsService: GeneralSettingsService,
    private seoService: SEOService,
  ) {}

  ngOnInit() {
    // this.getSettings();
    this.seoUpdate();
    this.adminAuthService.admin.subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }


  onSubmit() {
    this.isLoading = true;
    this.form.setErrors({
      invalidLogin: true
    });
    const data = JSON.stringify(this.form.value);
    this.adminAuthService.login(data).subscribe(
      resData => {
        if (resData) {
          this.adminAuthService.storeAdminAuthData(resData);
          this.authError = null;
          this.router.navigateByUrl('/dashboard');
        }
        this.isLoading = false;
      },
      err => {
        console.log(err);
        if (err.error.error) {
          if (err.error.error.includes('record')) {
            this.theMessage = err.error.error;
            this.showNotice = true;
            this.justMssg = true;
            this.removeNotice();
            this.authError = err.error.error;
          } else {
            this.authError = err.error.error;
            this.theMessage = err.error.error;
            this.showNotice = true;
            this.justMssg = true;
            this.removeNotice();
          }
        }
        this.isLoading = false;
      }
    );
  }


  private seoUpdate() {
    this.seoService.updateTitle('Aministrative Login Only');
    this.seoService.updateDescription('Aministrative Login Only');
  }

  // private getSettings() {
  //   this.generalSettingsService.getSettings.subscribe(res => {
  //     this.settings = res;
  //   });
  // }




  removeNotice(){
    setTimeout(() => {
      if (this.showNotice = true) {
        this.showNotice = false;
      }
    }, 5000);
  }

  closeMyNotice(){
    this.showNotice = false;
  }



}
