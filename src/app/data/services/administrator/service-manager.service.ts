import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceManagerService {

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


  getService(){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + "/service-manager/" + this.token
    )
  }

  getSingle(id){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + "/service-manager/single/" + this.token + '/' + id
    )
  }

  addService(data){
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/service-manager/add/' + this.token, data
    )
  }

  updateService(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/service-manager/update/' + this.token, data
    )
  }

  deleteService(id){
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/service-manager/delete/' + this.token + '/' + id
    )
  }


  addMainService(data){
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/service-manager/category/add/' + this.token, data
    )
  }

  updateMainService(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/service-manager/category/update/' + this.token, data
    )
  }

  listMainService(){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/service-manager/category/' + this.token
    )
  }


}
