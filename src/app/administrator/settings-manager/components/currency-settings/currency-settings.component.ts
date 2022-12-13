import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CurrencyService } from '../../../../data/services/currency.service';
import { ConfigService } from '../../../../data/services/config.service';
import { SEOService } from '../../../../data/services/seo.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-currency-settings',
  templateUrl: './currency-settings.component.html',
  styleUrls: ['./currency-settings.component.scss']
})
export class CurrencySettingsComponent implements OnInit {
  isLoading = false;
  defaultCurrency: any;
  currencies: any;

  isSetDefault = false;
  setId;

  form = new FormGroup({
    country: new FormControl('', []),
    code: new FormControl('', []),
    symbol: new FormControl('', []),
  });

  formDefault = new FormGroup({
    id: new FormControl('', []),
  });

  constructor(
    private currencyService: CurrencyService,
    private configService: ConfigService,
    private seoService: SEOService,
    private adminAuthService: AdminAuthService,
    private generalSettingsService: GeneralSettingsService,
  ) { }

  get adminUrl() {
    return this.configService.adminURL;
  }

  ngOnInit() {
    this.getCurrency();
    this.seoUpdate();
  }
  
  // private updateAuth() {
  //   this.adminAuthService.admin.subscribe(res => {
  //     if (res) {
  //       const data = this.configService.isRootAdmin(res);
  //       if (!data) {
  //         this.routingService.replace(['/' + this.adminUrl + '/dashboard']);
  //       }
  //     }
  //   });
  // }

  submit() {
    this.isLoading = true;
    const data = JSON.stringify(this.form.value);
    this.currencyService.add(data).subscribe(res => {
      if (res.data) {
        this.currencyService.currencyDefault().subscribe();
        alert('Currency Added Successfully!');
        this.getCurrency();
        this.form.reset();
      } else {
        alert('Oops! Someth went wrong, we could not process your request.');
      }
      this.isLoading = false;
    });
  }

  // submitDefault() {
  //   this.isLoading = true;
  //   const data = JSON.stringify(this.formDefault.value);
  //   this.currencyService.setDefault(data).subscribe(res => {
  //     if (res && res.status === 'success') {
  //       this.currencyService.currencyDefault().subscribe();
  //       alert('Currency Updated Successfully!');
  //     } else {
  //       alert('Oops! Someth went wrong, we could not process your request.');
  //     }
  //     this.isLoading = false;
  //   });
  // }

  // private getCurrency() {
  //   this.currencyService.getCurrency.subscribe(res => {
  //     this.defaultCurrency = res;
  //     this.formDefault.get('id').setValue(res.id);
  //     this.currencies = res.currencies;
  //   });
  // }

  private getCurrency() {
    this.generalSettingsService.getGenSettings().subscribe(res => {
      this.currencies = res.data.allCurrency;
      this.defaultCurrency = res.data.currency;
      this.formDefault.get('id').setValue(this.defaultCurrency.id);
    });
  }

  private seoUpdate() {
    this.seoService.updateTitle('Currency Settings');
    this.seoService.updateDescription('Currency Settings');
  }

  
  setDefaultCurrency(curID: number) {
    this.isSetDefault = true;
    this.setId = curID;
    if (confirm('Are you sure you want to SET this currency as default?') ) {
      this.currencyService.setDefault(curID).subscribe(res => {
        if(res.data){
          alert('Default currency successfully set');
          this.getCurrency();
          this.currencyService.currencyDefault().subscribe();
        }
      });
      this.isSetDefault = false;
    }
  }

  deleteCurrency(curID: number) {
    console.log(curID)
    if (confirm('Are you sure you want to DELETE this currency?') ) {
      this.currencyService.deleteCurr(curID).subscribe(res => {
        if(res.data){
          alert('Currency successfully deleted');
          this.getCurrency();
        }
      });
    }
  }

}
