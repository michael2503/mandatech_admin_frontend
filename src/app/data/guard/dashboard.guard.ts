import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      this.authService.checking.subscribe(checking => {
        if (!checking) {
          this.authService.user.subscribe(auth => {
            if (auth) {
              if (!+auth.email_verify) {
                this.router.navigate(['/user/verify-email']);
                resolve(this.router.parseUrl('/user/verify-email'));
              } else if (+auth.two_authenticate && !auth.token) {
                this.router.navigate(['/user/two-auth']);
                resolve(this.router.parseUrl('/user/two-auth'));
              } else {
                resolve(true);
              }
            }
          });
        }
      });
    });
  }

}
