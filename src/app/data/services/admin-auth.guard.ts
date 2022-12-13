import { CanLoad, NavigationCancel, Route, UrlSegment } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';

import { AdminAuthService } from './admin-auth.service';
import { StorageService } from '../helpers/storage.service';

@Injectable()
export class AdminAuthGuard implements CanLoad {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router,
    private storageService: StorageService,
  ) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise<boolean>((resolve) => {
      this.adminAuthService.checking.subscribe(checking => {
        if (!checking) {
          this.adminAuthService.admin.subscribe(isAuth => {
            if (!isAuth) {
              this.router.events.subscribe(event => {
                if (event instanceof NavigationCancel) {
                  if (!isAuth) {
                    this.storageService.storeData('returnUrl', event.url);
                  }
                }
              });
              this.router.navigate(['/login']);
              resolve(false);
            } else {
              resolve(true);
            }
          })
        }
      })
    })
  }


  private checkToken() {
    this.adminAuthService.admin.subscribe(resp => {
      if (resp && resp.token) {
        const currentDate = new Date().getTime();
        const tokenDate = new Date(resp.exp).getTime();
        if (tokenDate > currentDate) {
          return true;
        } else {
          this.adminAuthService.storeAdminAuthData(null);
          // this.adminAuthService.logout();
          return false;
        }
      } else {
        this.adminAuthService.storeAdminAuthData(null);
        // this.adminAuthService.logout();
        return false;
      }
    });
  }

}
