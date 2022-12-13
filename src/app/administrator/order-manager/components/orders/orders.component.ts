import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from 'src/app/data/services/admin-auth.service';
import { AdminManagerService } from 'src/app/data/services/administrator/admin-manager.service';
import { OrderManagerService } from 'src/app/data/services/administrator/order-manager.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { SEOService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  isLoading = false;
  adminstrators: any;
  adminstratorCounts = 0;
  limit = 50;
  currPage = 1;

  status = "all";
  pageLoader = true;

  isSearching = false;

  form = new FormGroup({
    keywords: new FormControl('', []),
  });

  constructor(
    private orderManagerService: OrderManagerService,
    private route: ActivatedRoute,

    private configService: ConfigService,
    private seoService: SEOService,
    private router: Router,
    private adminAuthService: AdminAuthService,
  ) { }

  ngOnInit() {
    this.updateAuth();
    this.seoUpdate();

    this.route.params.subscribe(param => {
      this.status = param['status'];
      this.getAllOrders()
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
  orders = [];
  orderCount = 0;

  private getAllOrders(isMore = false) {
    this.isLoading = true;
    this.orderManagerService.getAllOrder(
    this.status, this.pageLimit, this.currentPage
    ).subscribe(res => {
    if (res.data) {
        if (isMore) {
            for (let i = 0; i < res.data.data.length; i++) {
                this.orders.push(res.data.data[i]);
            }
        } else {
            this.orders = res.data.data;
        }
        this.orderCount = res.data.counts;
    }
    this.pageLoader = false;
    this.isLoading = false;
    this.isLoadMore = false;
    });
  }


  loadMore() {
      this.isLoadMore = true;
      if (this.orderCount > this.orders.length) {
        this.currentPage++;
        this.getAllOrders(true);
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
    this.orderManagerService.search(data).subscribe(res => {
      if (res) {
        this.orders = res.data.data;
        this.orderCount = res.data.counts;
      } else {
        this.orders = [];
      }
      this.isSearching = false;
    })
  }

  cancelSearch(){
    this.ngOnInit();
    this.form.reset();
  }

}
