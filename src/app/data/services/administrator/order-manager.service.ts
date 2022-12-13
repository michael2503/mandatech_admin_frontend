import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class OrderManagerService {

  private serverUrl: string;
  private adminUrl: string;
  private token: string;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private adminAuthService: AdminAuthService
  ) {
    this.serverUrl = this.config.baseUrl;
    this.adminUrl = this.config.adminBackUrl;
    this.adminAuthService.admin.subscribe(auth => {
      if (auth) { this.token = auth.token; }
    });
  }




  getReview(status, limit = 10, page = 1){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/review/' + this.token + '/' + status + '/' + limit + '/' + page
    )
  }

  updateReview(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + "/review/update/" + this.token, data
    )
  }

  approveReview(id){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/review/approve/' + this.token + '/' + id
    )
  }

  deleteReview(id){
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/review/delete/' + this.token + '/' + id
    )
  }

  singleReview(id){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/review/single/' + this.token + '/' + id
    )
  }

  searchReview(keyword){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/review/search/' + this.token + '/' + keyword
    )
  }


  getAllOrder(status, limit = 10, page = 1) {
    return this.http.get<any>(
        this.serverUrl + this.adminUrl + '/order-manager/' + this.token + '/' + status + '/' + limit + '/' + page
    );
  }


  getOrderSingle(orderNum) {
    return this.http.get<any>(
        this.serverUrl + this.adminUrl + '/order-manager/single/' + this.token + '/' + orderNum
    );
  }

  search(keywords) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/order-manager/search/' + this.token + '/' + keywords
    );
  }

  orderAction(orderID, action) {
    return this.http.get<any>(
        this.serverUrl + this.adminUrl + '/order-manager/action/' + this.token + '/' + orderID + '/' + action
    );
  }


  getAllCoupon(status, limit = 10, page = 1) {
    return this.http.get<any>(
        this.serverUrl + this.adminUrl + '/order-manager/coupons/' + this.token + '/' + status + '/' + limit + '/' + page
    );
  }

  searchCoupon(keywords) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/order-manager/coupons/search/' + this.token + '/' + keywords
    );
  }

  addCoupon(data) {
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/order-manager/coupons/add/' + this.token, data
    );
  }

  deleteCoupon(id, from) {
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/order-manager/coupons/delete/' + this.token + '/' + id + '/' + from
    );
  }



}
