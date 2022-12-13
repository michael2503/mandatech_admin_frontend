import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserManagerService } from 'src/app/data/services/administrator/user-manager.service';

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent implements OnInit {
  @Input() customer;

  pageLoader = true;

  constructor(
    private userManagerService: UserManagerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getAllOrders();
  }


  pageLimit = 5;
  currentPage = 1;
  isLoadMore = false;
  orders = [];
  orderCount = 0;

  private getAllOrders(isMore = false) {
    this.userManagerService.userOrders(
    this.customer.id, this.pageLimit, this.currentPage
    ).subscribe(res => {
      console.log(res)
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

}
