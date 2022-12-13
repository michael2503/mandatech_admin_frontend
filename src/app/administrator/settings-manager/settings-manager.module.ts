import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsManagerRoutingModule } from './settings-manager-routing.module';

import { WebsiteSettingsComponent } from './components/website-settings/website-settings.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
// tslint:disable-next-line: max-line-length
import { CurrencySettingsComponent } from './components/currency-settings/currency-settings.component';
// tslint:disable-next-line: max-line-length
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SocialSettingsComponent } from './components/social-settings/social-settings.component';
import { NigeriaBanksComponent } from './components/nigeria-banks/nigeria-banks.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    WebsiteSettingsComponent,
    ConfigurationComponent,
    CurrencySettingsComponent,
    SocialSettingsComponent,
    NigeriaBanksComponent
  ],

  imports: [
    CommonModule,
    SettingsManagerRoutingModule,
    AdminSharedModule,
    SharedModule
  ]
})
export class SettingsManagerModule { }
