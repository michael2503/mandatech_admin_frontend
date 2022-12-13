import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from 'src/app/data/services/admin-auth.service';
import { DashboardService } from 'src/app/data/services/administrator/dashboard.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SEOService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  adm;
  isRootAdmin;
  info;

  constructor(
    private configService: ConfigService,
    private seoService: SEOService,
    private adminAuthService: AdminAuthService,
    private dashboardService: DashboardService,
    private generalSettingsService: GeneralSettingsService,
  ) { }

  get adminUrl() {
    return this.configService.adminURL;
  }

  reviewNotice = [];

  ngOnInit() {
    this.updateAuth();
    this.seoUpdate();
    this.dashInfo();
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.adm = res;
        const data = this.configService.isRootAdmin(res);
        if (data) {
          this.isRootAdmin = true;
        }
      }
    });
  }


  clearnUrl(name) {
    return this.configService.clearnUrl(name);
  }

  private seoUpdate() {
    this.seoService.updateTitle('Admin Dasboard');
    this.seoService.updateDescription('Admin Dasboard');
  }


  private dashInfo() {
    this.dashboardService.getInfo()
    .subscribe(res => {
      console.log(res)
      if (res) {
        this.info = res.data;
        this.reviewNotice = res.data.reviewNotice;
      }
    });
  }

}
