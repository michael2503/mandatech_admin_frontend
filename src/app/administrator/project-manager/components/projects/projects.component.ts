import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectManagerService } from 'src/app/data/services/administrator/project-manager.service';
import { PaginationService } from 'src/app/data/services/pagination.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isDeleting = false;

  SortDropdown: boolean = false;
  isSearching: boolean = false;

  projects = [];
  projectCounts = 0;
  paginationLink;
  isLoadMore = true;
  isLoading = true;

  formSearch = new FormGroup({
    keywords: new FormControl('', []),
  });

  pageLimit = 10;
  currPage = 1;

  constructor(
    private projectManagerService: ProjectManagerService,
    private route: ActivatedRoute,
    private pageS: PaginationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      // this.customerStatus = param.status;
      this.currPage = +param['page'] || 1;
      this.getProjects(this.pageLimit, this.currPage);
    });
  }


  private getProjects(page, currPage, isMore = false) {
    this.projectManagerService.getProject(
      page, currPage
    ).subscribe(res => {
      if (res) {
        if (isMore) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.projects.push(res.data.data[i]);
          }
        } else {
          this.projects = res.data.data;
        }
        this.projectCounts = res.data.counts;
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
    this.projectManagerService.search(data).subscribe(res => {
      if (res) {
          this.projects = res.data.data;
        this.projectCounts = res.data.counts;
      } else {
        this.projects = [];
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


  returnID;
  deleteProject(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this project?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.projectManagerService.deleteProject(id).subscribe(res => {
        if (res.data) {
          this.ngOnInit();
          this.theMessage = "Project successfully deleted.";
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
