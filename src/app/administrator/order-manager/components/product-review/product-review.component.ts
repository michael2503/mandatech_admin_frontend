import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderManagerService } from 'src/app/data/services/administrator/order-manager.service';
import { PaginationService } from 'src/app/data/services/pagination.service';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss']
})
export class ProductReviewComponent implements OnInit {
  isLoadMore;
  isLoading;

  isDeleting = false;

  pageLimit = 10;
  currPage = 1;

  reviews = [];
  reviewCounts = 0;
  paginationLink;

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isSearching = false;

  formSearch = new FormGroup({
    keywords: new FormControl('', [ Validators.required ])
  })

  n(n){
    return this.formSearch.get(n);
  }
  status = 'all';
  constructor(
    private route: ActivatedRoute,
    private orderManagerService: OrderManagerService,
    private pageS: PaginationService,
  ) { }

  ngOnInit(): void {
    // this.route.params.subscribe(param => {
    //   this.currPage = +param['page'] || 1;
    //   this.getAllReviews(this.pageLimit, this.currPage);
    // });

    this.route.params.subscribe(param => {
      this.status = param['status'];
      this.getAllReviews()
    });
  }


  private getAllReviews(isMore = false) {
    this.orderManagerService.getReview(
      this.status, this.pageLimit, this.currPage
    ).subscribe(res => {
      console.log(res)
      if (res) {
        if (isMore) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.reviews.push(res.data.data[i]);
          }
        } else {
          this.reviews = res.data.data;
        }
        this.reviewCounts = res.data.counts;
        this.paginationLink = this.pageS.links(res.data.counts, this.pageLimit, this.currPage);
      }
      this.isLoadMore = false;
      this.isLoading = false;
    });
  }

  changingLimit = false;
  selectPerPage(event) {
    this.changingLimit = true;
    this.pageLimit = event.target.value;
    this.currPage = 1;
    this.ngOnInit();
    this.changingLimit = false;
  }

  loadMore() {
    this.isLoadMore = true;
    if (this.reviewCounts > this.reviews.length) {
      this.currPage++;
      this.getAllReviews(true);
    }
  }


  returnID;
  deleteRev(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this review?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.orderManagerService.deleteReview(id).subscribe(res => {
        if (res.data) {
          this.ngOnInit();
          this.theMessage = "Review successfully deleted.";
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
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

  submit(){
    const data = this.formSearch.get('keywords').value;
    if(data == ''){
      return;
    }
    this.isSearching = true;
    this.orderManagerService.searchReview(data).subscribe(res => {
      if(res){
        this.reviews = res.data.data
        this.reviewCounts = res.data.count
      }
      this.isSearching = false;
    })
  }

  canselSearch(){
    this.formSearch.get('keywords').setValue('');
    this.ngOnInit();
  }

}
