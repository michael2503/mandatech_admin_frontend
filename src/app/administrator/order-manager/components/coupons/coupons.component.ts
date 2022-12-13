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
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  isLoading = false;
  adminstrators: any;
  adminstratorCounts = 0;


  status = "all";
  pageLoader = true;
  isSubmitting = false;
  isDeleting = true;

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

  users = [];

  formAdd = new FormGroup({
    userID: new FormControl('', [ Validators.required ]),
    amount: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required ]),
  })
  n(n) {
    return this.form.get(n);
  }

  constructor(
    private orderManagerService: OrderManagerService,
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
      this.allCoupons()
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
  coupons = [];
  couponCount = 0;

  private allCoupons(isMore = false) {
    this.isLoading = true;
    this.orderManagerService.getAllCoupon(
    this.status, this.pageLimit, this.currentPage
    ).subscribe(res => {
    if (res.data) {
        if (isMore) {
            for (let i = 0; i < res.data.data.length; i++) {
                this.coupons.push(res.data.data[i]);
            }
        } else {
            this.coupons = res.data.data;
        }
        this.couponCount = res.data.counts;
    }
    this.pageLoader = false;
    this.isLoading = false;
    this.isLoadMore = false;
    });
  }


  loadMore() {
      this.isLoadMore = true;
      if (this.couponCount > this.coupons.length) {
        this.currentPage++;
        this.allCoupons(true);
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
    this.seoService.updateTitle('Admin Listing');
    this.seoService.updateDescription('Admin Listing');
  }

  submit(){
    this.isSearching = true;
    const data = this.form.value.keywords;
    this.orderManagerService.searchCoupon(data).subscribe(res => {
      if (res) {
        this.coupons = res.data.data;
        this.couponCount = res.data.counts;
      } else {
        this.coupons = [];
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
      this.theMessage = "Are you sure you want to DELETE this coupon?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.orderManagerService.deleteCoupon(id, 'all').subscribe(res => {
        if (res.data) {
          this.coupons = res.data.data;
          this.couponCount = res.data.counts;
          this.theMessage = "Coupon deleted successfully.";
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
  }

  submitAdd(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.formAdd.value);
    this.orderManagerService.addCoupon(data).subscribe(res => {
      console.log(res)
      if(res){
        this.coupons = res.data.data;
        this.couponCount = res.data.counts;
        this.theMessage = "Coupon successfully added.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.form.reset();
        this.closeModal.next(true);
      }
      this.isSubmitting = false;
    })
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

  inputVal;
  isSearchingUser = false;
  getInputVal(event){
    this.inputVal = event.target.value;
  }

  searchUser(){
    this.isSearchingUser = true;
    this.userManagerService.search(this.inputVal).subscribe(res => {
      if(res){
        this.users = res.data.data
      }
      this.isSearchingUser = false;
      this.isUserAvail = true;
    })
  }

  selectedUser(id, email){
    this.formAdd.get('userID').setValue(id);
    this.formAdd.get('email').setValue(email);
    this.isUserAvail = false;
    console.log(id)
    console.log(email)
  }

  cancelSearchUser(){
    this.isUserAvail = false;
    this.formAdd.get('email').setValue('');
    this.formAdd.get('userID').setValue('');
  }

  copInfo;
  singleCoupon(cid){
    this.copInfo = this.coupons.filter(cont => cont.id === parseInt(cid))[0];
  }
}
