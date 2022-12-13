import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestimonialManagerService } from 'src/app/data/services/administrator/testimonial-manager.service';
import { PaginationService } from 'src/app/data/services/pagination.service';

@Component({
  selector: 'app-testimony',
  templateUrl: './testimony.component.html',
  styleUrls: ['./testimony.component.scss']
})
export class TestimonyComponent implements OnInit {

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isDeleting = false;


  testimonies = [];
  testimonyCounts = 0;
  paginationLink;
  isLoadMore = true;
  isLoading = true;


  pageLimit = 10;
  currPage = 1;


  constructor(
    private testimonialManagerService: TestimonialManagerService,
    private route: ActivatedRoute,
    private pageS: PaginationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      // this.customerStatus = param.status;
      this.currPage = +param['page'] || 1;
      this.getProducts(this.pageLimit, this.currPage);
    });
  }


  private getProducts(page, currPage, isMore = false) {
    this.testimonialManagerService.getTestimony(
      page, currPage
    ).subscribe(res => {
      console.log(res)
      if (res) {
        if (isMore) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.testimonies.push(res.data.data[i]);
          }
        } else {
          this.testimonies = res.data.data;
        }
        this.testimonyCounts = res.data.counts;
        this.paginationLink = this.pageS.links(res.data.counts, this.pageLimit, this.currPage);
      }
      this.isLoadMore = false;
      this.isLoading = false;
    });
  }

  removeNotice() {
    setTimeout(() => {
      if (this.showNotice = true) {
        this.showNotice = false;
      }
    }, 5000);
  }

  closeMyNotice() {
    this.showNotice = false;
  }

  returnID;
  deleteTestimony(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this testimony?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.testimonialManagerService.deleteTestimony(id).subscribe(res => {
        if (res.data) {
          this.ngOnInit();
          this.theMessage = "Testimony successfully deleted.";
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
  }


  get pageUrl() {
    return `${this.router.url.replace(/\/page\/\d+/, '')}/page`;
  }

}
