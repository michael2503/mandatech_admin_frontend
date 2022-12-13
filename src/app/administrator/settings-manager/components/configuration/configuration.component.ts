import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigService } from '../../../../data/services/config.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SettingsManagerService } from 'src/app/data/services/administrator/settings-manager.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  isAdding = false;
  isLoading: any;
  config: any;
  authAdmin: any;
  justMssg = false;


  theMessage: any;
  showNotice = false;

  form = new FormGroup({
    ConfigID: new FormControl('', []),
    client: new FormControl('', []),
    testimony: new FormControl('', []),
    exp_year: new FormControl('', []),
    no_of_project: new FormControl('', []),
    recommendation: new FormControl('', []),
    product_sold: new FormControl('', []),
  });

  constructor(
    private configService: ConfigService,
    private settingsManagerService: SettingsManagerService,
    private adminAuthService: AdminAuthService,
    private generalSettingsService: GeneralSettingsService,
  ) { }

  ngOnInit() {
    this.thisAdmin();
    this.getConfig();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private thisAdmin() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.authAdmin = res;
      }
    });
  }

  private getConfig() {
    this.generalSettingsService.getGenSettings().subscribe(res => {

      this.config = res.data.configuration;
      console.log(this.config);
      this.retrieveData(this.config);
    });
  }

  private retrieveData(res) {
    this.form.get('ConfigID').setValue(res.id);
    this.form.get('client').setValue(res.client);
    this.form.get('testimony').setValue(res.testimony);
    this.form.get('exp_year').setValue(res.exp_year);
    this.form.get('no_of_project').setValue(res.no_of_project);
    this.form.get('recommendation').setValue(res.recommendation);
    this.form.get('product_sold').setValue(res.product_sold);
  }

  submit() {
    this.isLoading = true;
    const data = JSON.stringify(this.form.value);
    this.settingsManagerService.update_configuration(data).subscribe(res => {
      if (res) {
        this.justMssg = true;
        this.theMessage = "Updated successfully!";
      } else {
        this.justMssg = true;
        this.theMessage = "Oops! We could not add your request.";
      }
      this.isLoading = false;
      this.showNotice = true;
      this.removeNotice();
    });
  }


  removeNotice(){
    setTimeout(() => {
      if (this.showNotice = true) {
        this.showNotice = false;
      }
    }, 7000);
  }

  closeMyNotice(){
    this.showNotice = false;
  }

}
