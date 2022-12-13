import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class ContentManagerService {

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


  //HOME BANNER
  getHomeBanner(){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + "/contents/home-banner/" + this.token
    )
  }

  addHomeBanner(data){
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/contents/home-banner/add/' + this.token, data
    )
  }

  updateHomeBanner(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/contents/home-banner/update/' + this.token, data
    )
  }

  deleteHomeBanner(id){
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/contents/home-banner/delete/' + this.token + '/' + id
    )
  }
  //HOME BANNER


  //ABOUT US
  getAboutUs(){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + "/contents/about-us/" + this.token
    )
  }

  updateAboutUs(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/contents/about-us/update/' + this.token, data
    )
  }


  //ABOUT US
  getWhyChoseUs(){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + "/contents/why-chose-us/" + this.token
    )
  }

  updateWhyChoseUs(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/contents/why-chose-us/update/' + this.token, data
    )
  }


  //COMPANY HISTORY
  getComHistory(){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + "/contents/company-history/" + this.token
    )
  }

  updateComHistory(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/contents/company-history/update/' + this.token, data
    )
  }

  addComHistory(data){
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/contents/company-history/add/' + this.token, data
    )
  }

  deleteComHistory(id){
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/contents/company-history/delete/' + this.token + '/' + id
    )
  }


  //OUR TEAM
  getOurTeam(){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + "/contents/our-team/" + this.token
    )
  }

  addOurTeam(data){
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/contents/our-team/add/' + this.token, data
    )
  }

  updateOurTeam(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/contents/our-team/update/' + this.token, data
    )
  }

  deleteOurTeam(id){
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/contents/our-team/delete/' + this.token + '/' + id
    )
  }
  //OUR TEAM


  //OUR CLIENT
  getOurClient(){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + "/contents/our-client/" + this.token
    )
  }

  addOurClient(data){
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/contents/our-client/add/' + this.token, data
    )
  }

  deleteOurClient(id){
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/contents/our-client/delete/' + this.token + '/' + id
    )
  }



    //ABOUT SERVICE
    getAboutService(){
      return this.http.get<any>(
        this.serverUrl + this.adminUrl + "/contents/about-service/" + this.token
      )
    }

    addAboutService(data){
      return this.http.post<any>(
        this.serverUrl + this.adminUrl + '/contents/about-service/add/' + this.token, data
      )
    }

    updateAboutService(data){
      return this.http.put<any>(
        this.serverUrl + this.adminUrl + '/contents/about-service/update/' + this.token, data
      )
    }

    deleteAboutService(id){
      return this.http.delete<any>(
        this.serverUrl + this.adminUrl + '/contents/about-service/delete/' + this.token + '/' + id
      )
    }
    //ABOUT SERVICE


}
