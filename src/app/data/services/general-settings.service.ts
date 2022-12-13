import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { StorageService } from '../helpers/storage.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralSettingsService {
  private baseUrl;
  private settings = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private storageService: StorageService,
  ) {
    this.baseUrl = this.config.baseUrl;
  }

  get genSettings() {
    return this.settings.asObservable();
  }

  getGenSettings() {
    return this.http.get<any>(
      `${this.baseUrl}general-settings`
    ).pipe(tap(res => {
      this.settings.next(res.data);
    }));
  }

  updateSettings(postData: string) {
    return this.http.post<any>(
      `${this.baseUrl}admin/update-web-settings/`, postData
    );
  }

}
