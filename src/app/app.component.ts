import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AdminAuthService } from './data/services/admin-auth.service';
import { AuthService } from './data/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Mandatech Group';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private adminAuthService: AdminAuthService,
  ) {}

  ngOnInit() {
    this.autoLogin();
    this.adminAutoLogin();
  }

  private autoLogin() {
    this.authService.autoLogin();
  }

  private adminAutoLogin() {
    this.adminAuthService.autoLogin();
  }

  scrollTop() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.scrollTop = 0;
    }
  }
}
