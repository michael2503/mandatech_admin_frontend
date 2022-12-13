import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ContentManagerService } from 'src/app/data/services/administrator/content-manager.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.scss']
})
export class OurTeamComponent implements OnInit {

  isLoading = true;
  isSubmitting = false;
  isUpdating = false;
  isDeleting = false;
  teams = [];

  uploadedBanners = '';
  uploadedBannersEdit = '';

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  closeModal = new BehaviorSubject(false);

  form = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    position: new FormControl('', [ Validators.required ]),
    image: new FormControl('', [ Validators.required ]),
    twitter: new FormControl('', []),
    instagram: new FormControl('', []),
    facebook: new FormControl('', []),
    linkedin: new FormControl('', []),
  })
  n(n) {
    return this.form.get(n);
  }

  formEdit = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    position: new FormControl('', [ Validators.required ]),
    image: new FormControl('', [ Validators.required ]),
    twitter: new FormControl('', [  ]),
    instagram: new FormControl('', [  ]),
    facebook: new FormControl('', [  ]),
    linkedin: new FormControl('', [  ]),
    id: new FormControl('', [  ]),
  })
  fedit(fedit) {
    return this.formEdit.get(fedit);
  }

  constructor(
    private contentManagerService: ContentManagerService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.allOurTeam()
  }

  private allOurTeam(){
    this.contentManagerService.getOurTeam().subscribe(res => {
      if(res){
        this.teams = res.data;
      }
    })
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.contentManagerService.addOurTeam(data).subscribe(res => {
      if(res){
        this.allOurTeam();
        this.theMessage = "Team member successfully added.";
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

      if(role == 'mainForm'){
        if(this.validateImage(width, height, 0, 0, 320, 304) === 'error'){
          this.bannerUploadErr = true
          return;
        };
      }

      if(role == 'updateForm'){
        if(this.validateImage(width, height, 0, 0, 320, 304) === 'error'){
          this.bannerUploadEditErr = true
          return;
        };
      }
      this.uploadFile(selectedFile, role, 1, 1, 1000, 1000);
    };
  }

  private validateImage(width, height, minWith, minHeight, maxWidth, maxHeight){
    if(width > maxWidth || width < minWith || height > maxHeight || height < minHeight){
      return "error"
    } else {
      return 'upload'
    }
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
              this.form.get('image').setValue(event.body.secure_url);
              this.uploadedBanners = event.body.secure_url;
            } else {
              this.formEdit.get('image').setValue(event.body.secure_url);
              this.uploadedBannersEdit = event.body.secure_url;
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

  banInfo;
  getEachBanner(id){
    this.banInfo = this.teams.filter(cont => cont.id === parseInt(id))[0];

    if(this.banInfo){
      this.formEdit.get('name').setValue(this.banInfo.name);
      this.formEdit.get('position').setValue(this.banInfo.position);
      this.formEdit.get('image').setValue(this.banInfo.image);
      this.formEdit.get('facebook').setValue(this.banInfo.facebook);
      this.formEdit.get('instagram').setValue(this.banInfo.instagram);
      this.formEdit.get('twitter').setValue(this.banInfo.twitter);
      this.formEdit.get('linkedin').setValue(this.banInfo.linkedin);
      this.formEdit.get('id').setValue(this.banInfo.id);
      this.uploadedBannersEdit = this.banInfo.image;
    }
  }

  submitEdit(){
    if (this.formEdit.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.formEdit.value);
    this.contentManagerService.updateOurTeam(data).subscribe(res => {
      if(res){
        this.allOurTeam();
        this.theMessage = "Team member successfully updated.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.closeModal.next(true);
        this.uploadedBannersEdit = '';
        this.removeLabelBannerEdit = true;
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
      this.theMessage = "Are you sure you want to DELETE this team member?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.contentManagerService.deleteOurTeam(id).subscribe(res => {
        if (res.data) {
          this.allOurTeam();
          this.theMessage = "team member deleted successfully.";
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
