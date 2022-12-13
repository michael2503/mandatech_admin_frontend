import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ContentManagerService } from 'src/app/data/services/administrator/content-manager.service';

@Component({
  selector: 'app-company-history',
  templateUrl: './company-history.component.html',
  styleUrls: ['./company-history.component.scss']
})
export class CompanyHistoryComponent implements OnInit {


  isLoading = true;
  isSubmitting = false;
  isUpdating = false;
  isDeleting = false;
  histories = [];


  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  closeModal = new BehaviorSubject(false);

  form = new FormGroup({
    year: new FormControl('', [ Validators.required ]),
    title: new FormControl('', [ Validators.required ]),
    contents: new FormControl('', [ Validators.required ]),
  })
  n(n) {
    return this.form.get(n);
  }

  formEdit = new FormGroup({
    id: new FormControl('', [ Validators.required ]),
    year: new FormControl('', [ Validators.required ]),
    title: new FormControl('', [ Validators.required ]),
    contents: new FormControl('', [ Validators.required ]),
  })
  fedit(fedit) {
    return this.formEdit.get(fedit);
  }

  constructor(
    private contentManagerService: ContentManagerService,
  ) { }

  ngOnInit(): void {
    this.allCompanyHistory()
  }

  private allCompanyHistory(){
    this.contentManagerService.getComHistory().subscribe(res => {
      if(res){
        this.histories = res.data;
      }
    })
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.contentManagerService.addComHistory(data).subscribe(res => {
      if(res){
        this.allCompanyHistory();
        this.theMessage = "Company history added successfully.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.form.reset();
      }
      this.isSubmitting = false;
    })
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


  banInfo;
  getEachBanner(id){
    this.banInfo = this.histories.filter(cont => cont.id === parseInt(id))[0];

    if(this.banInfo){
      this.formEdit.get('id').setValue(this.banInfo.id);
      this.formEdit.get('year').setValue(this.banInfo.year);
      this.formEdit.get('title').setValue(this.banInfo.title);
      this.formEdit.get('contents').setValue(this.banInfo.contents);
    }
  }

  submitEdit(){
    if (this.formEdit.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.formEdit.value);
    this.contentManagerService.updateComHistory(data).subscribe(res => {
      if(res){
        this.allCompanyHistory();
        this.theMessage = "Company history successfully updated.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.closeModal.next(true);
      }
      this.isSubmitting = false;
    })
  }


  returnID;
  deleteHistory(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this history?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.contentManagerService.deleteComHistory(id).subscribe(res => {
        if (res.data) {
          this.allCompanyHistory();
          this.theMessage = "Banner successfully deleted.";
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
