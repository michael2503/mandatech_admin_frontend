import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SEOService } from '../../../../data/services/seo.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SettingsManagerService } from 'src/app/data/services/administrator/settings-manager.service';

@Component({
  selector: 'app-social-settings',
  templateUrl: './social-settings.component.html',
  styleUrls: ['./social-settings.component.scss']
})
export class SocialSettingsComponent implements OnInit {
  isLoading: any;
  allSocail: any;
  authAdmin: any;

  theMessage: any;
  showNotice = false;
  justMssg = false;
  deleteModal = false;

  isDeleting = false;

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    link: new FormControl('', [
      Validators.required,
    ]),
    icon: new FormControl('', [
      Validators.required,
    ]),
  });

  get name() {
    return this.form.get('name');
  }
  get link() {
    return this.form.get('link');
  }
  get icon() {
    return this.form.get('icon');
  }

  constructor(
    private configService: ConfigService,
    private seoService: SEOService,
    private settingsManagerService: SettingsManagerService,
    private generalSettingsService: GeneralSettingsService,
    private adminAuthService: AdminAuthService,
  ) { }

  ngOnInit() {
    this.thisAdmin();
    this.getSocial();
    this.seoUpdate();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private thisAdmin() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.authAdmin = res;
      }
    });
  }

  private getSocial(){
    this.generalSettingsService.getGenSettings().subscribe(res => {
      if(res) {
        this.allSocail = res.data.social_link;
      }
    })
  }

  submit() {
    this.isLoading = true;
    const data = JSON.stringify(this.form.value);
    this.settingsManagerService.addSocialSettings(data).subscribe(res => {
      if (res) {
        this.getSocial();
        this.theMessage = "Added successfully!";
        this.form.reset();
      } else {
        this.theMessage = "Oops! We could not add your request.";
      }
      this.isLoading = false;
      this.showNotice = true;
      this.justMssg = true;
      this.removeNotice();
    });
  }

  // deleID;
  // // DELETE
  // openDelModal(socialID: number) {
  //   this.showNotice = true;
  //   this.deleteModal = true;
  //   this.removeNotice();
  //   this.deleID = socialID;
  // }

  // deleteSocail(){
  //   console.log(this.deleID);
  //   this.settingsManagerService.deleteSocial(this.deleID).subscribe(res => {
  //     if(res){
  //       this.theMessage = "Deleted successfully";
  //       this.ngOnInit();
  //       this.showNotice = true;
  //       this.deleteModal = false;
  //       this.justMssg = true;
  //       this.removeNotice();
  //     }
  //   });
  // }

  returnID;
  deleteSocail(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this Social link?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.settingsManagerService.deleteSocial(id).subscribe(res => {
        if (res.data) {
          this.getSocial();
          this.theMessage = "Link successfully deleted.";
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
  }


  private seoUpdate() {
    this.seoService.updateTitle('Social Settings');
    this.seoService.updateDescription('Social Settings');
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
