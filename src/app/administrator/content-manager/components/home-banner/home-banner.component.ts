import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ContentManagerService } from 'src/app/data/services/administrator/content-manager.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.scss']
})
export class HomeBannerComponent implements OnInit {

  isLoading = true;
  isSubmitting = false;
  isUpdating = false;
  isDeleting = false;
  banners = [];

  uploadedBanners = '';
  uploadedBannersEdit = '';
  uploadedImageEdit = '';

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  closeModal = new BehaviorSubject(false);

  form = new FormGroup({
    title: new FormControl('', [ Validators.required ]),
    sub_title: new FormControl('', [ Validators.required ]),
    content: new FormControl('', [ Validators.required ]),
    banner: new FormControl('', [  ]),
    btn_link: new FormControl('', [ Validators.required ]),
    btn_title: new FormControl('', [ Validators.required ]),
  })
  n(n) {
    return this.form.get(n);
  }

  formEdit = new FormGroup({
    id: new FormControl('', [ Validators.required ]),
    title: new FormControl('', [ Validators.required ]),
    sub_title: new FormControl('', [ Validators.required ]),
    image: new FormControl('', [ Validators.required ]),
    content: new FormControl('', [ Validators.required ]),
    banner: new FormControl('', [ Validators.required ]),
    btn_link: new FormControl('', [ Validators.required ]),
    btn_title: new FormControl('', [ Validators.required ]),
  })
  fedit(fedit) {
    return this.formEdit.get(fedit);
  }

  constructor(
    private contentManagerService: ContentManagerService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.allBanners()
  }

  private allBanners(){
    this.contentManagerService.getHomeBanner().subscribe(res => {
      if(res){
        this.banners = res.data;
      }
    })
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.contentManagerService.addHomeBanner(data).subscribe(res => {
      if(res){
        this.allBanners();
        this.theMessage = "Banner added successfully.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.form.reset();
        this.uploadedBanners = '';
        this.removeLabelBanner = true;
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

  selectedFile: File = null;
  selectedFileName: string;
  uploadedFile: string;
  uploadingProgress = 0;
  logoUploadingProgress = 0;
  bannerUploadErr;
  bannerUploadEditErr;

  onloadFile(eventAlt, role) {
    this.logoUploadingProgress = 1;
    this.uploadingProgress = 0;
    const selectedFile = <File>eventAlt.target.files[0];
    //
    const reader = new FileReader();
    const img = new Image();
    img.src = window.URL.createObjectURL( selectedFile );
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      const minWidth = 1600;
      const minHeight = 750;

      const maxWidth = 2200;
      const maxHeight = 1031;

      // if(width > maxWidth || width < minWidth){
      //   if(role == 'mainForm'){
      //     this.bannerUploadErr = true
      //   } else {
      //     this.bannerUploadEditErr = true
      //   }
      //   return;
      // }
      // if(height > maxHeight || height < minHeight){
      //   if(role == 'mainForm'){
      //     this.bannerUploadErr = true
      //   } else {
      //     this.bannerUploadEditErr = true
      //   }
      //   return;
      // }
      this.uploadFile(selectedFile, role, 1, 1, 1000, 1000);
    };
  }

  private uploadFile(selectedFile, name, width, height, mxWidth, mxHeight) {
    const fd = new FormData;
    fd.append('file', selectedFile, selectedFile.name);
    this.fileUploadService.cloudUpload(
      fd, 'assets', name
    )
    .subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadingProgress = Math.round(event.loaded / event.total * 100 );
        } else if (event.type === HttpEventType.Response) {
          if (event.body.secure_url) {
            if(name == 'mainForm'){
              // this.form.get('banner').setValue(event.body.secure_url);
              // this.uploadedBanners = event.body.secure_url;
            } else {
              if(name == 'theBanner'){
                this.formEdit.get('banner').setValue(event.body.secure_url);
                this.uploadedBannersEdit = event.body.secure_url;
              } else if(name == 'theImage'){
                console.log(event.body.secure_url)
                this.formEdit.get('image').setValue(event.body.secure_url);
                this.uploadedImageEdit = event.body.secure_url;
              }
            }
            this.bannerUploadErr = false
            this.bannerUploadEditErr = false
          }
          this.uploadingProgress = 0;
          this.logoUploadingProgress = 0;
        }
      },
      err => {

      }
    );
  }

  removeLabelBanner = true;
  removeUploadBanner(){
    this.uploadedBanners = '';
    this.removeLabelBanner = true;
  }

  removeLabelBannerEdit = true;
  removeUploadBannerEdit(){
    this.uploadedBannersEdit = '';
    this.removeLabelBannerEdit = true;
  }

  removeLabelImageEdit = true;
  removeUploadImageEdit(){
    this.uploadedImageEdit = '';
    this.removeLabelImageEdit = true;
  }

  banInfo;
  getEachBanner(id){
    this.banInfo = this.banners.filter(cont => cont.id === parseInt(id))[0];

    if(this.banInfo){
      this.formEdit.get('title').setValue(this.banInfo.title);
      this.formEdit.get('content').setValue(this.banInfo.content);
      this.formEdit.get('btn_link').setValue(this.banInfo.btn_link);
      this.formEdit.get('btn_title').setValue(this.banInfo.btn_title);
      this.formEdit.get('banner').setValue(this.banInfo.banner);
      this.formEdit.get('image').setValue(this.banInfo.image);
      this.formEdit.get('id').setValue(this.banInfo.id);
      this.formEdit.get('sub_title').setValue(this.banInfo.sub_title);``
      this.uploadedBannersEdit = this.banInfo.banner;
      this.uploadedImageEdit = this.banInfo.image;
    }
  }

  submitEdit(){
    if (this.formEdit.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.formEdit.value);
    this.contentManagerService.updateHomeBanner(data).subscribe(res => {
      if(res){
        this.allBanners();
        this.theMessage = "Banner successfully updated.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.closeModal.next(true);
        this.uploadedBannersEdit = '';
        this.uploadedImageEdit = '';
        this.removeLabelBannerEdit = true;
        this.removeLabelImageEdit = true;
      }
      this.isSubmitting = false;
    })
  }


  returnID;
  deleteBanner(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this banner?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.contentManagerService.deleteHomeBanner(id).subscribe(res => {
        if (res.data) {
          this.allBanners();
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
