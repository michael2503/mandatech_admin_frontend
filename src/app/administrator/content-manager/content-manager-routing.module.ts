import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutServiceComponent } from './components/about-service/about-service.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CompanyHistoryComponent } from './components/company-history/company-history.component';
import { HomeBannerComponent } from './components/home-banner/home-banner.component';
import { OurClientComponent } from './components/our-client/our-client.component';
import { OurTeamComponent } from './components/our-team/our-team.component';
import { WhyChoseUsComponent } from './components/why-chose-us/why-chose-us.component';

const routes: Routes = [
  { path: 'home-banner', component: HomeBannerComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'company-history', component: CompanyHistoryComponent },
  { path: 'our-team', component: OurTeamComponent },
  { path: 'our-client', component: OurClientComponent },
  { path: 'why-chose-us', component: WhyChoseUsComponent },
  { path: 'about-service', component: AboutServiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentManagerRoutingModule { }
