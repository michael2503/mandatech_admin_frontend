import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  auth;
  showSearch = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAuth();
  }

  private getAuth() {
    this.authService.user.subscribe(auth => {
      console.log(auth);
      this.auth = auth;
    });
  }

  logout() {
    this.authService.logout();
  }

}
