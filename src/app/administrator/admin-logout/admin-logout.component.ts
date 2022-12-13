import { Component, OnInit } from '@angular/core';
// import { AdminAuthService } from '../../data/services/admin-auth.service';

@Component({
  selector: 'app-admin-logout',
  templateUrl: './admin-logout.component.html',
  styleUrls: ['./admin-logout.component.scss']
})
export class AdminLogoutComponent implements OnInit {

  constructor(
    // private adminAuthService: AdminAuthService
  ) {}

  ngOnInit() {
    // this.adminAuthService.logout();
  }

}
