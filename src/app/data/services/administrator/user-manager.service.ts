import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {

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


  getAllUsers(status, limit, page) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user-manager/' + this.token + '/' + status + '/' + limit + '/' + page
    );
  }

  singleUser(id) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user-manager/single/' + this.token + '/' + id
    );
  }

  deleteUser(id) {
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/user-manager/delete/' + this.token + '/' + id
    );
  }

  accountAction(userID: number, action: string) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user-manager/account/action/' + this.token + '/' + userID + '/' + action
    );
  }

  updateUserInfo(data) {
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/user-manager/update-profile/' + this.token, data
    );
  }


  userOrders(id, limit, page) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user-manager/orders/' + this.token + '/' + id + '/' + limit + '/' + page
    );
  }

  userCoupons(id, limit, page) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user-manager/coupons/' + this.token + '/' + id + '/' + limit + '/' + page
    );
  }

  userAddress(id) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user-manager/address/' + this.token + '/' + id
    );
  }

  updateUserAdd(data) {
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/user-manager/address/update/' + this.token, data
    );
  }

  deleteUserAddress(id) {
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/user-manager/address/delete/' + this.token + '/' + id
    );
  }



  search(keywords) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/user-manager/search/' + this.token + '/' + keywords
    );
  }


}
