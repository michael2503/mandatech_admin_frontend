import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { BannerCarouselComponent } from './components/banner-carousel/banner-carousel.component';
import { CusAccordionComponent } from './components/cus-accordion/cus-accordion.component';
import { TimeAgoPipe } from './pipe/time-ago.pipe';
import { TreatImgUrlPipe } from './pipe/treat-img-url.pipe';
import { DropdownDirective } from './directives/dropdown.directive';
import { TogglePassDirective } from './directives/toggle-pass.directive';
import { AllowNumDirective } from './directives/allow-num.directive';
import { ModalModule } from './modules/modal/modal.module';
import { SizeConvPipe } from './pipe/size-conv.pipe';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';
import { SafeUrlPipe } from './pipe/safe-url.pipe';
import { LoadingBtnComponent } from './components/loading-btn/loading-btn.component';
import { TextTransformPipe } from './pipe/text-transform.pipe';
import { BankPipe } from './pipe/bank.pipe';
import { CountDownComponent } from './components/count-down/count-down.component';
import { SummaryPipe } from './pipe/summary.pipe';
import { UrlToStringPipe } from './pipe/url-to-string.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DropdownComponent,
    BannerCarouselComponent,
    CusAccordionComponent,
    TimeAgoPipe,
    TreatImgUrlPipe,
    DropdownDirective,
    TogglePassDirective,
    AllowNumDirective,
    SizeConvPipe,
    PaginationComponent,
    SafeHtmlPipe,
    SafeUrlPipe,
    LoadingBtnComponent,
    TextTransformPipe,
    BankPipe,
    CountDownComponent,
    SummaryPipe,
    UrlToStringPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule
  ],
  exports: [
    FormsModule,
    ModalModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    DropdownComponent,
    BannerCarouselComponent,
    CusAccordionComponent,
    TimeAgoPipe,
    DropdownDirective,
    TogglePassDirective,
    AllowNumDirective,
    SizeConvPipe,
    PaginationComponent,
    TreatImgUrlPipe,
    SafeHtmlPipe,
    SafeUrlPipe,
    LoadingBtnComponent,
    TextTransformPipe,
    BankPipe,
    CountDownComponent,
    SummaryPipe,
    UrlToStringPipe
  ]
})
export class SharedModule { }
