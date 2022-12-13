import { Component, Input, OnInit } from '@angular/core';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { ConfigService } from '../../../../data/services/config.service';
import { StorageService } from '../../../../data/helpers/storage.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-admin-nav-content',
  templateUrl: './admin-nav-content.component.html',
  styleUrls: ['./admin-nav-content.component.scss']
})
export class AdminNavContentComponent implements OnInit {
  role: any;
  admin: any;
  isRootAdmin = false;

  @Input() mainpage;
  @Input() page;

  constructor(
    private adminAuthService: AdminAuthService,
    private configService: ConfigService,
    private storageService: StorageService,
    private generalSettingsService: GeneralSettingsService,
  ) { }

  get adminUrl() {
    return this.configService.adminURL;
  }

  ngOnInit() {
    this.updateAuth();
    this.updateActiveMenu();
    this.getSettings();
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.admin = res;
        const data = this.configService.isRootAdmin(res);
        if (data) {
          this.isRootAdmin = true;
        }
      }
    });
  }

  webSet;
  private getSettings() {
    this.generalSettingsService.getGenSettings().subscribe(res => {
      if (res) {
        this.webSet = res.data.websiteSettings;
      }
    });
  }

  toggle(role) {
    this.storageService.storeData('adminNavMenu', role);
    this.role = (this.role === role) ? null : role;
  }

  private updateActiveMenu() {
    if (this.storageService.hasKey('adminNavMenu')) {
      this.role = this.storageService.getData('adminNavMenu');
    } /* else {
      const route = this.routingService.activeRoute;
      this.toggle(route);
    } */
  }

  logout() {
    this.adminAuthService.logout(this.admin.id)
  }

  toggleCloseSideNav(){
    var sideNav = document.getElementById("menu-wrapper");
    sideNav.style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
    document.getElementById("adminInfo").style.position = "unset";
    document.getElementById("maximizeNav").style.display = "inline-block";
    document.getElementById("minimizeNav").style.display = "none";
  }

  toggleOpenSideNav(){
    var sideNav = document.getElementById("menu-wrapper");
    sideNav.style.width = "260px";
    document.getElementById("main").style.marginLeft = "260px";
    document.getElementById("maximizeNav").style.display = "none";
    document.getElementById("minimizeNav").style.display = "inline-block";
  }

}
