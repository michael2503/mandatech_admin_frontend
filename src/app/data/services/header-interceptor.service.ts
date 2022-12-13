import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptorService implements HttpInterceptor {
  private token;

  constructor(
    private authService: AuthService
  ) {
    this.authService.user.subscribe(auth => {
      this.token = auth?.token;
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.token) {
      return next.handle(req.clone({
        headers: req.headers.set('Api-Token', this.token)
      }));
    }
    return next.handle(req);
  }
}
