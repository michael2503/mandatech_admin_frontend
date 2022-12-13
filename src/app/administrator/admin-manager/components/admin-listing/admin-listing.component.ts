import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../../data/services/config.service';
import { AdminManagerService } from '../../../../data/services/administrator/admin-manager.service';
import { SEOService } from '../../../../data/services/seo.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-listing',
  templateUrl: './admin-listing.component.html',
  styleUrls: ['./admin-listing.component.scss']
})
export class AdminListingComponent implements OnInit {
  isLoading = false;
  adminstrators: any;
  adminstratorCounts = 0;
  limit = 50;
  currPage = 1;

  constructor(
    private configService: ConfigService,
    private adminManagerService: AdminManagerService,
    private seoService: SEOService,
    private router: Router,
    private adminAuthService: AdminAuthService,
  ) { }

  ngOnInit() {
    this.updateAuth();
    this.getAdmins();
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

  private getAdmins() {
    this.adminManagerService.getAll(this.limit, this.currPage)
    .subscribe(res => {
      if (res) {
        this.adminstrators = res.data.data;
        this.adminstratorCounts = res.data.counts;
      }
    });
  }

  delete(adm) {
    const x = 'Are you sure you want to delete ' + adm.username + '?';
    if (confirm(x)) {
      this.adminManagerService.delete(adm.id).subscribe(res => {

        if (res.data) {
          this.getAdmins();
          alert('Admin deleted successfully.');
        } else {
          alert('Oops! Something went wrong, we could not process your request.');
        }
      });
    }
  }

  private seoUpdate() {
    this.seoService.updateTitle('Admin Listing');
    this.seoService.updateDescription('Admin Listing');
  }

}
