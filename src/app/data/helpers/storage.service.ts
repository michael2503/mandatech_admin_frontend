import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as localforage from 'localforage';
import { CookieManagerService } from '../services/cookie-manager.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieManagerService: CookieManagerService,
  ) { }

  storeData(key, value) {
    localforage.setItem(key, value);
  }

  async getData(key) {
    return await localforage.getItem(key);
  }

  removeData(key) {
    localforage.removeItem(key);
  }

  async hasKey(key: string) {
    return isPlatformBrowser(this.platformId) ? !!await localforage.getItem(key) : this.cookieManagerService.hasKey(key);
  }
}
