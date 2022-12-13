import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { StorageService } from '../helpers/storage.service';
import { ConfigService } from './config.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl;
  private _user = new BehaviorSubject(null);
  checking = new BehaviorSubject(true);

  constructor(
    private http: HttpClient,
    config: ConfigService,
    private storageService: StorageService
  ) {
    this.baseUrl = config.baseUrl;
  }

  get user() {
    return this._user.asObservable();
  }

  signup(data) {
    return this.http.post<any>(
      `${this.baseUrl}register`, data
    ).pipe(tap(res => {
      this.storeAuth(res.data);
    }));
    let convData = JSON.parse(data);
    convData.email_verify = 1;
    convData.token = '1234k2aslkdfasdl';
    convData.two_authentication = 0;
    return of(convData).pipe(tap(auth => {
      this.storeAuth(auth);
    }));
  }

  checkEmail(data) {
    return this.http.post<any>(
      `${this.baseUrl}forgot-password`, data
    )
  }

  verifyCode(data) {
    return this.http.post<any>(
      `${this.baseUrl}forgot-password/submit-token`, data
    )
  }

  twoAuth(data) {
    return this.http.post<any>(
      `${this.baseUrl}login/verify`, data
    ).pipe(tap(res => {
      this.storeAuth(res.data);
    }));
  }

  changePass(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/account-settings/change-password`, data
    )
  }

  twoFactorSet(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/account-settings/set-two-factor`, data
    ).pipe(tap(res => {
      this.storeAuth(res.data);
    }));
  }

  login(data) {
    return this.http.post<any>(
      `${this.baseUrl}login`, data
    ).pipe(tap(res => {
      this.storeAuth(res.data);
    }));
    let convData = JSON.parse(data);
    convData.email_verify = 1;
    convData.token = '1234k2aslkdfasdl';
    convData.two_authentication = 0;
    return of(convData).pipe(tap(auth => {
      this.storeAuth(auth);
    }));
  }

  resendCode() {
    return this.http.get<any>(
      `${this.baseUrl}user/account-settings/resend-token`
    )
  }

  updateProfile(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/account-settings/profile`, data
    ).pipe(tap(res => {
      this.storeAuth(res.data);
    }));
  }

  verifyEmail(data) {
    return this.http.post<any>(
      `${this.baseUrl}user/account-settings/email-verify`, data
    ).pipe(tap(res => {
      this.storeAuth(res.data);
    }));
    let convData = this._user.value;
    convData.email_verify = 1;
    return of(convData).pipe(tap(auth => {
      this.storeAuth(auth);
    }));
  }

  updateAuth(data) {
    //  return this.http.post<any>(
    //    `${this.baseUrl}login`, data
    //  )
    let convData = { ...this._user.value, ...JSON.parse(data) };
    return of(convData).pipe(tap(auth => {
      this.storeAuth(auth);
    }));
  }

  storeAuth(auth) {
    this._user.next(auth);
    this.storageService.storeData('userData', auth);
  }

  async autoLogin() {
    let storedAuth = <Object>await this.storageService.getData('userData');
    if (storedAuth) {
      this._user.next({ ...storedAuth, id: 1 });
    }
    this.checking.next(false);
  }

  logout() {
    this._user.next(null);
    this.storageService.removeData('userData');
  }

}
