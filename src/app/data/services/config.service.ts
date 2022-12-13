import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  get adminURL() {
    return 'administrator';
  }

  get adminBackUrl() {
    return 'admin';
  }


  baseUrl = 'https://api.mandatechgroup.com/backend/laravel/';
  // baseUrl = 'http://127.0.0.1:8000/'



  isRootAdmin(admin) {
    if (admin && admin.id === 1) {
      return true;
    } else {
      return false;
    }
  }

  clearnUrl(name) {
    const str = name.trim();
    if (str) {
      return str.replace(/[^a-zA-Z0-9 &+,._-]/g, '').split('&').join('and')
        .split(' + ').join('-').split('+ ').join('-').split('+').join('-')
        .split(', ').join('-').split(',').join('-')
        .split('  ').join('-').split(' - ').join('-').split(' ').join('-')
        .toLowerCase().replace(/^-/g, '');
    }
  }

  getRandomString(lengthCnt, id = null) {
    let result = '',
      i;
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (i = lengthCnt; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }


}
