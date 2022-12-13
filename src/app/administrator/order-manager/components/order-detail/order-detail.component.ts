import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderManagerService } from 'src/app/data/services/administrator/order-manager.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  orderNum;
  order;
  products = [];

  pageLoader = false;

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isStatus = false;


  constructor(
    private route: ActivatedRoute,
    private orderManagerService: OrderManagerService,
  ) { }

  ngOnInit(): void {
    this.orderNum = this.route.snapshot.paramMap.get('orderNum');
    this.orderSingle()
  }


  private orderSingle(){
    this.orderManagerService.getOrderSingle(this.orderNum).subscribe(res => {
      console.log(res)
      if(res){
          this.order = res.data;
          this.products = JSON.parse(this.order.cart_info);
      }
      this.pageLoader = false;
    })
  }

  selectedStatus;
  changeStatus(event){
    this.selectedStatus = event.target.value;
  }

  returnID;
  deleteRev(warning) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to " + this.selectedStatus + " this order?";
    } else {
      this.isStatus = true;
      this.orderManagerService.orderAction(this.order.id, this.selectedStatus).subscribe(res => {
        if (res.data) {
          this.theMessage = "Order successfully " + this.selectedStatus;
          this.order = res.data;
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isStatus = false;
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
