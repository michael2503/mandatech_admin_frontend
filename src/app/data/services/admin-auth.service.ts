import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';

import { ConfigService } from './config.service';
// import { RoutingService } from '../helpers/routing.service';
import { StorageService } from '../helpers/storage.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { ErrorHandlerService } from './error-handler.service';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private serverUrl: string;
  private _admin = new BehaviorSubject<any>(null);
  checking = new BehaviorSubject(true);

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private storageService: StorageService,
    private router: Router,
  ) {
    this.serverUrl = this.config.baseUrl;
  }

  get admin() {
    return this._admin.asObservable();
  }

  login(data) {
    return this.http
      .post<any>(
        `${this.serverUrl}admin/login`,
        data
      ).pipe(tap(auth => {
        if (auth) {
          this.storeAdminAuthData(auth);
        }
      }));
  }

  forgotPassword(data) {
    return this.http
      .post<any>(
        `${this.serverUrl}admin/forgot-password`,
        data
      );
  }

  verifyToken(data) {
    return this.http
      .post<any>(
        `${this.serverUrl}admin/forgot-password/submit-token`,
        data
      );
  }

  resetPassword(data) {
    return this.http
      .post<any>(
        `${this.serverUrl}admin/forgot-password/reset-password`,
        data
      );
  }

  logout(id) {
    this.http.delete<any>(
      this.serverUrl + '/admin/logout/' + id
    );
    this._admin.next(null);
    this.storageService.removeData('adminData');
    this.router.navigateByUrl('/login');
  }

  async autoLogin() {
    this.checking.next(true);
    // const adminData = JSON.parse(await this.storageService.getString('adminData'));
    const adminData = <Object>await this.storageService.getData('adminData');
    this._admin.next(adminData);
    this.checking.next(false);
  }

  // Used within and outside
  storeAdminAuthData(adminAuth: any) {
    this.storageService.storeData('adminData', adminAuth);
    this._admin.next(adminAuth);
  }

}
