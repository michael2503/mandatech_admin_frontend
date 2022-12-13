import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductManagerService } from 'src/app/data/services/administrator/product-manager.service';
import { PaginationService } from 'src/app/data/services/pagination.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isDeleting = false;

  SortDropdown: boolean = false;
  isSearching: boolean = false;

  products = [];
  productCounts = 0;
  paginationLink;
  isLoadMore = true;
  isLoading = true;

  form = new FormGroup({
    theSort: new FormControl('', [])
  });

  formSearch = new FormGroup({
    keywords: new FormControl('', []),
  });

  pageLimit = 10;
  currPage = 1;

  sortResult = 'RA';

  constructor(
    private productManagerService: ProductManagerService,
    private route: ActivatedRoute,
    private pageS: PaginationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      // this.customerStatus = param.status;
      this.currPage = +param['page'] || 1;
      this.getProducts(this.pageLimit, this.currPage, this.sortResult);
    });
    this.form.get('theSort').setValue("Sort By: Recently Added");
  }


  private getProducts(page, currPage, sort, isMore = false) {
    this.productManagerService.getAllProduct(
      page, currPage, sort
    ).subscribe(res => {
      if (res) {
        if (isMore) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.products.push(res.data.data[i]);
          }
        } else {
          this.products = res.data.data;
        }
        this.productCounts = res.data.counts;
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

  changingLimit = false;
  selectPerPage(event) {
    this.changingLimit = true;
    this.pageLimit = event.target.value;
    this.currPage = 1;
    this.ngOnInit();
    this.changingLimit = false;
  }


  submit() {
    this.isSearching = true;
    const data = this.formSearch.value.keywords;
    this.productManagerService.search(data, this.sortResult).subscribe(res => {
      if (res) {
          this.products = res.data.data;
        this.productCounts = res.data.counts;
      } else {
        this.products = [];
      }
      this.isSearching = false;
        this.isSearching = false;
    })
  }

  get pageUrl() {
    return `${this.router.url.replace(/\/page\/\d+/, '')}/page`;
  }

  openSortDropdown(){
    this.SortDropdown = !this.SortDropdown;
  }

  selectSort(res, sort){
    this.form.get('theSort').setValue("Sort By: " + res);
    this.SortDropdown = false;
    this.sortResult = sort;
    this.getProducts(this.pageLimit, this.currPage, sort);
  }


  returnID;
  deleteProduct(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this product?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.productManagerService.deleteProd(id).subscribe(res => {
        if (res.data) {
          this.ngOnInit();
          this.theMessage = "Product successfully deleted.";
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
  }

}
