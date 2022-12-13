import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdminAuthService } from '../admin-auth.service';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductManagerService {

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


  getCategory(){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/product-manager/category/' + this.token
    )
  }

  addcategory(data){
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/product-manager/category/add/' + this.token, data
    )
  }

  deleteCategory(id){
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/product-manager/category/delete/' + this.token + '/' + id
    )
  }



  getAllProduct(limit = 10, page = 1, sort: any){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/product-manager/' + this.token + '/' + limit + '/' + page + '/' + sort
    )
  }

  addProduct(data){
    return this.http.post<any>(
      this.serverUrl + this.adminUrl + '/product-manager/add/' + this.token, data
    )
  }

  singleProduct(id){
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/product-manager/single/' + this.token + '/' + id,
    )
  }

  updateProduct(data){
    return this.http.put<any>(
      this.serverUrl + this.adminUrl + '/product-manager/update/' + this.token, data
    )
  }

  search(keywords, sort) {
    return this.http.get<any>(
      this.serverUrl + this.adminUrl + '/product-manager/search/' + this.token + '/' + keywords + '/' + sort
    );
  }

  deleteProd(proID) {
    return this.http.delete<any>(
      this.serverUrl + this.adminUrl + '/product-manager/delete/' + this.token + '/' + proID
    );
  }

}
