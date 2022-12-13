import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { OrderManagerService } from 'src/app/data/services/administrator/order-manager.service';
import { UserManagerService } from 'src/app/data/services/administrator/user-manager.service';

@Component({
  selector: 'app-user-coupon',
  templateUrl: './user-coupon.component.html',
  styleUrls: ['./user-coupon.component.scss']
})
export class UserCouponComponent implements OnInit {

  @Input() customer;

  pageLoader = true;

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isDeleting = false;

  closeModal = new BehaviorSubject(false);

  constructor(
    private userManagerService: UserManagerService,
    private orderManagerService: OrderManagerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getAllCoupons();
  }


  pageLimit = 5;
  currentPage = 1;
  isLoadMore = false;
  coupons = [];
  couponCount = 0;

  private getAllCoupons(isMore = false) {
    this.userManagerService.userCoupons(
    this.customer.id, this.pageLimit, this.currentPage
    ).subscribe(res => {
      console.log(res)
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
    this.isLoadMore = false;
    });
  }


  loadMore() {
    this.isLoadMore = true;
    if (this.couponCount > this.coupons.length) {
      this.currentPage++;
      this.getAllCoupons(true);
    }
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
      this.orderManagerService.deleteCoupon(id, 'user').subscribe(res => {
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

  copInfo;
  singleCoupon(cid){
    this.copInfo = this.coupons.filter(cont => cont.id === parseInt(cid))[0];
  }

}
