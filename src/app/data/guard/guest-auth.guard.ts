import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      this.authService.checking.subscribe(checking => {
        if (!checking) {
          this.authService.user.subscribe(auth => {
            if (auth && +auth.email_verify && +auth.two_authenticate && auth.token) {
              this.router.navigate(['/user'], { replaceUrl: true });
              resolve(false);
            } else {
              resolve(true);
            }
          });
        }
      });
    });
  }
  
}
