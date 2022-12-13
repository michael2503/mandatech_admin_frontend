import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../../data/services/config.service';
import { SEOService } from '../../../../data/services/seo.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss']
})
export class EditAdminComponent implements OnInit {
  isLoading = false;
  isAdding = false;
  adm: any;
  updateSuccess: any;

  theMessage: any;
  justMssg;
  showNotice = false;

  constructor(
    private configService: ConfigService,
    private seoService: SEOService,
    private router: Router,
    private adminAuthService: AdminAuthService,
  ) { }

  ngOnInit() {
    this.updateAuth();
    this.seoUpdate();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        const data = this.configService.isRootAdmin(res);
        if (!data) {
          this.router.navigateByUrl('/' + this.adminUrl + '/dashboard');
        }
      }
    });
  }

  getFeedback(data) {
    this.theMessage = data;
    this.justMssg = true;
    this.showNotice = true;
    this.removeNotice();
    this.updateSuccess = data;
    // alert(data);
  }

  getAdminInfo(data) {
    this.adm = data;
  }

  private seoUpdate() {
    this.seoService.updateTitle('Edit Admin');
    this.seoService.updateDescription('Edit Admin');
  }

  removeNotice(){
    setTimeout(() => {
      if (this.showNotice = true) {
        this.showNotice = false;
        this.justMssg = false;
      }
    }, 7000);
  }

  closeMyNotice(){
    this.showNotice = false;
    this.justMssg = false;
  }

}
