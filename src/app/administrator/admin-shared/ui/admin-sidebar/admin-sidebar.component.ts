import { Component, OnInit, Input } from '@angular/core';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { ConfigService } from '../../../../data/services/config.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  @Input() menuObj: any;



  adm;

  constructor(
    private adminAuthService: AdminAuthService,
    private configService: ConfigService
  ) { }

  get adminUrl() {
    return this.configService.adminURL;
  }

  ngOnInit() {
    this.updateAuth()
  }


  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.adm = res;
      }
    });
  }


  logout() {
    this.adminAuthService.logout(this.adm.id)
  }

}
