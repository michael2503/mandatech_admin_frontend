import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ContentManagerService } from 'src/app/data/services/administrator/content-manager.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  isSubmitting = false;

  uploadedBanners = '';
  uploadedBannersEdit = '';

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  form = new FormGroup({
    id: new FormControl('', [ Validators.required ]),
    title: new FormControl('', [ Validators.required ]),
    sub_title: new FormControl('', [ Validators.required ]),
    content: new FormControl('', [ Validators.required ]),
    first_banner: new FormControl('', [ Validators.required ]),
    second_banner: new FormControl('', [ Validators.required ]),
    icon_title_one: new FormControl('', [ Validators.required ]),
    icon_title_two: new FormControl('', [ Validators.required ]),
    icon_title_three: new FormControl('', [ Validators.required ]),
  })
  n(n) {
    return this.form.get(n);
  }

  about;

  constructor(
    private contentManagerService: ContentManagerService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.aboutUsPage()
  }


  private aboutUsPage(){
    this.contentManagerService.getAboutUs().subscribe(res => {
      if(res){
        this.about = res.data;
        this.fillInput(this.about);
      }
    })
  }


  private fillInput(res){
    this.form.get('id').setValue(res.id);
    this.form.get('title').setValue(res.title);
    this.form.get('sub_title').setValue(res.sub_title);
    this.form.get('content').setValue(res.content);
    this.form.get('first_banner').setValue(res.first_banner);
    this.form.get('second_banner').setValue(res.second_banner);
    this.form.get('icon_title_one').setValue(res.icon_title_one);
    this.form.get('icon_title_two').setValue(res.icon_title_two);
    this.form.get('icon_title_three').setValue(res.icon_title_three);
    this.uploadedBanners = res.first_banner;
    this.uploadedBannersEdit = res.second_banner;
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.contentManagerService.updateAboutUs(data).subscribe(res => {
      if(res){
        this.aboutUsPage();
        this.theMessage = "About us info successfully updated.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
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

      // if(role == 'mainForm'){
      //   if(this.validateImage(width, height, 400, 346, 600, 520) === 'error'){
      //     this.bannerUploadErr = true
      //     return;
      //   };
      // }

      // if(role == 'updateForm'){
      //   if(this.validateImage(width, height, 180, 150, 300, 251) === 'error'){
      //     this.bannerUploadEditErr = true
      //     return;
      //   };
      // }

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
              this.form.get('first_banner').setValue(event.body.secure_url);
              this.uploadedBanners = event.body.secure_url;
            } else {
              this.form.get('second_banner').setValue(event.body.secure_url);
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


  // WYSIWYG
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: 'auto',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'algerian', name: 'Algerian' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

}
