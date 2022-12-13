import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class TestimonialManagerService {

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

  getTestimony(limit, page) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/testimonial-manager/' + this.token + '/' + limit + '/' + page
    );
  }

  addTestimony(data: string) {
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/testimonial-manager/add/' + this.token, data
    );
  }


  updateTestimony(data: string) {
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/testimonial-manager/update/' + this.token, data
    );
  }

  deleteTestimony(testID: number) {
    return this.http.delete<any>(
        this.serverUrl + this.adminUrl + '/testimonial-manager/delete/' + this.token + '/' + testID
    );
  }


  singleTestimony(testID: number) {
    return this.http.get<any>(
        this.serverUrl + this.adminUrl + '/testimonial-manager/single/' + this.token + '/' + testID
    );
  }


}
