import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AdminAuthService } from 'src/app/data/services/admin-auth.service';
import { OrderManagerService } from 'src/app/data/services/administrator/order-manager.service';
import { UserManagerService } from 'src/app/data/services/administrator/user-manager.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { SEOService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  isLoading = false;
  adminstrators: any;
  adminstratorCounts = 0;


  status = "all";
  pageLoader = true;
  isSubmitting = false;
  isDeleting = false;

  isSearching = false;
  isUserAvail = false;

  form = new FormGroup({
    keywords: new FormControl('', []),
  });

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
  ) { }

  ngOnInit() {
    this.updateAuth();
    this.seoUpdate();

    this.route.params.subscribe(param => {
      this.status = param['status'];
      this.allUsers()
    });
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


  pageLimit = 10;
  currentPage = 1;
  isLoadMore = false;
  users = [];
  userCount = 0;

  private allUsers(isMore = false) {
    this.isLoading = true;
    this.userManagerService.getAllUsers(
    this.status, this.pageLimit, this.currentPage
    ).subscribe(res => {
    if (res.data) {
        if (isMore) {
            for (let i = 0; i < res.data.data.length; i++) {
                this.users.push(res.data.data[i]);
            }
        } else {
            this.users = res.data.data;
        }
        this.userCount = res.data.counts;
    }
    this.pageLoader = false;
    this.isLoading = false;
    this.isLoadMore = false;
    });
  }


  loadMore() {
      this.isLoadMore = true;
      if (this.userCount > this.users.length) {
        this.currentPage++;
        this.allUsers(true);
      }
  }

  changingLimit = false;
  selectPerPage(event) {
    this.changingLimit = true;
    this.pageLimit = event.target.value;
    this.currentPage = 1;
    this.ngOnInit();
    this.changingLimit = false;
  }


  private seoUpdate() {
    this.seoService.updateTitle('User Manager');
    this.seoService.updateDescription('User Manager');
  }

  submit(){
    this.isSearching = true;
    const data = this.form.value.keywords;
    this.userManagerService.search(data).subscribe(res => {
      console.log(res)
      if (res) {
        this.users = res.data.data;
        this.userCount = res.data.counts;
      } else {
        this.users = [];
      }
      this.isSearching = false;
    })
  }

  cancelSearch(){
    this.ngOnInit();
    this.form.reset();
  }

  returnID;
  deleteBanner(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this user?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.userManagerService.deleteUser(id).subscribe(res => {
        console.log(res);
        if (res.data) {
          this.users = res.data.data;
          this.userCount = res.data.counts;
          this.theMessage = "User deleted successfully.";
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
