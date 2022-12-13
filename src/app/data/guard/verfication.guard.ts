import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VerficationGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      this.authService.user.subscribe(auth => {
        if (!+auth?.bank_verify || !auth?.phone) {
          resolve(this.router.parseUrl('/user'));
        } else {
          resolve(true);
        }
      });
    });
  }

}
