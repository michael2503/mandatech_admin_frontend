import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {

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




  getProject(limit = 10, page = 1){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/project-manager/' + this.token + '/' + limit + '/' + page
    )
  }

  getSingle(id){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + "/project-manager/single/" + this.token + '/' + id
    )
  }

  addProject(data){
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/project-manager/add/' + this.token, data
    )
  }

  updateProject(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/project-manager/update/' + this.token, data
    )
  }

  deleteProject(id){
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/project-manager/delete/' + this.token + '/' + id
    )
  }

  search(keywords) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/project-manager/search/' + this.token + '/' + keywords
    );
  }


}
