import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl;
  private token: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private adminAuthService: AdminAuthService,
  ) {
    this.baseUrl = configService.baseUrl;
    this.adminAuthService.admin.subscribe(auth => {
      if (auth) { this.token = auth.token; }
    });
  }

  getInfo() {
    return this.http.get<any>(
      // `${this.baseUrl}admin/dashboard`
      this.baseUrl + 'admin/dashboard/' + this.token
    ).pipe(tap(res => { }));
  }
}
