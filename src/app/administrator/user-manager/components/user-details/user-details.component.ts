import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RoutingService } from 'src/app/data/helpers/routing.service';
import { AdminAuthService } from 'src/app/data/services/admin-auth.service';
import { UserManagerService } from 'src/app/data/services/administrator/user-manager.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { SEOService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  customer: any;
  userAddresses: any;

  isLoading = false;

  thePage = 'profile';

  pageLoader = true;
  isSubmitting = false;
  isDeleting = false;

  isSearching = false;
  isUserAvail = false;

  userID;
  user;
  userAddress = [];

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  closeModal = new BehaviorSubject(false);

  constructor(
    private route: ActivatedRoute,

    private configService: ConfigService,
    private seoService: SEOService,
    private router: Router,
    private adminAuthService: AdminAuthService,
    private userManagerService: UserManagerService,
    private routeService: RoutingService,
  ) { }

  ngOnInit() {
    this.updateAuth();
    this.seoUpdate();

    this.userID = this.route.snapshot.paramMap.get('id');

    this.singleUser();
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


  private singleUser() {
    this.userManagerService.singleUser(this.userID).subscribe(res => {
    if (res.data) {
      this.user = res.data.data;
      this.userAddress = res.data.address;
    }
    this.pageLoader = false;
    this.isLoading = false;
    });
  }

  changeTab(role){
    this.thePage = role;
  }



  private seoUpdate() {
    this.seoService.updateTitle('User Details');
    this.seoService.updateDescription('User Details');
  }

  returnID;
  returnAction;
  accountAction(warning, id: number, action) {
    let temp = action.split('ed')[0];
    if (action === 'Active') { temp = 'Activate'; }
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = 'Are you sure you want to ' + temp + ' this user?';
      this.returnID = id;
      this.returnAction = action;
    } else {
      this.isDeleting = true;
      this.userManagerService.accountAction(id, action).subscribe(res => {
        if(res.data.status === 'success' && action == 'Delete'){
          this.routeService.replace([
            '/user-manager/all'
          ]);
        } else  if (res) {
          this.singleUser();
          this.theMessage = "User successfully " + action;
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
  }

  removeNotice() {
    setTimeout(() => {
      if (this.showNotice = true) {
        this.showNotice = false;
      }
    }, 5000);
  }

  closeMyNotice() {
    this.showNotice = false;
  }


}
