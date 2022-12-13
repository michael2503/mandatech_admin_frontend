import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebsiteSettingsComponent } from './components/website-settings/website-settings.component';
import { CurrencySettingsComponent } from './components/currency-settings/currency-settings.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { SocialSettingsComponent } from './components/social-settings/social-settings.component';
import { NigeriaBanksComponent } from './components/nigeria-banks/nigeria-banks.component';

const routes: Routes = [
    { path: '', component: WebsiteSettingsComponent },
    { path: 'website-settings', component: WebsiteSettingsComponent },
    { path: 'social-settings', component: SocialSettingsComponent },
    { path: 'currency-settings', component: CurrencySettingsComponent },
    { path: 'configuration', component: ConfigurationComponent },
    { path: 'bank-accounts', component: NigeriaBanksComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsManagerRoutingModule { }
