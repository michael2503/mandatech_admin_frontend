import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      this.authService.checking.subscribe(checking => {
        if (!checking) {
          this.authService.user.subscribe(auth => {
            if (!auth) {
              this.router.navigate(['/login']);
              resolve(this.router.parseUrl('/login'));
            } else {
              resolve(true);
            }
          });
        }
      });
    });
  }
}
