import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsManagerService {
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

  getConfiguration() {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/configuration_manager/getConfiguration/' +
      this.token
    );
  }

  update_configuration(data: string) {
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/update-configuration/' + this.token, data
    );
  }


  updateSettings(data: string) {
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/update-web-settings/' + this.token, data
    );
  }


  addSocialSettings( msgData: string) {
    return this.http.post<any>(
        this.serverUrl + this.adminUrl + '/add-social-link/' + this.token, msgData
      );
  }

  deleteSocial(socialID: number) {
    return this.http.delete<any>(
        this.serverUrl + this.adminUrl + '/delete-social-link/' + this.token + '/' + socialID
    );
  }

  addBank( msgData: string) {
    return this.http.post<any>(
        this.serverUrl + this.adminUrl + '/bank/add/' + this.token, msgData
      );
  }

  deleteBank(bankID: number) {
    return this.http.delete<any>(
        this.serverUrl + this.adminUrl + '/bank/delete/' + this.token + '/' + bankID
    );
  }

  updateBank(data) {
    return this.http.put<any>(
        this.serverUrl + this.adminUrl + '/bank/update/' + this.token, data
    );
  }

}
