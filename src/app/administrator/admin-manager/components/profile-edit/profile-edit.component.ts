import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../../../../data/services/config.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  isLoading = false;
  adm: any;
  updateSuccess: any;

  constructor(
    private configService: ConfigService,
    private adminAuthService: AdminAuthService,
  ) { }

  ngOnInit() {
    this.updateAuth();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) { this.adm = res;  }
    });
  }

  getFeedback(data) {
    this.updateSuccess = data;
  }

}
