import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentManagerRoutingModule } from './content-manager-routing.module';
import { HomeBannerComponent } from './components/home-banner/home-banner.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CompanyHistoryComponent } from './components/company-history/company-history.component';
import { OurTeamComponent } from './components/our-team/our-team.component';
import { OurClientComponent } from './components/our-client/our-client.component';
import { AdminSharedModule } from '../admin-shared/admin-shared.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { WhyChoseUsComponent } from './components/why-chose-us/why-chose-us.component';
import { ProjectComponent } from './components/project/project.component';
import { AboutServiceComponent } from './components/about-service/about-service.component';


@NgModule({
  declarations: [
    HomeBannerComponent,
    AboutUsComponent,
    CompanyHistoryComponent,
    OurTeamComponent,
    OurClientComponent,
    WhyChoseUsComponent,
    ProjectComponent,
    AboutServiceComponent
  ],
  imports: [
    CommonModule,
    ContentManagerRoutingModule,
    AdminSharedModule,
    SharedModule,
    AngularEditorModule,
  ]
})
export class ContentManagerModule { }
