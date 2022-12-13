import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ContentManagerService } from 'src/app/data/services/administrator/content-manager.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';

@Component({
  selector: 'app-why-chose-us',
  templateUrl: './why-chose-us.component.html',
  styleUrls: ['./why-chose-us.component.scss']
})
export class WhyChoseUsComponent implements OnInit {

  isSubmitting = false;

  uploadedBanners = '';
  uploadedBannersEdit = '';

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  form = new FormGroup({
    id: new FormControl('', [ Validators.required ]),
    small_title: new FormControl('', [ Validators.required ]),
    main_title: new FormControl('', [ Validators.required ]),
    btn_title: new FormControl('', [ Validators.required ]),
    btn_link: new FormControl('', [ Validators.required ]),
    content: new FormControl('', [ Validators.required ]),
    mission_title: new FormControl('', [ Validators.required ]),
    mission_icon: new FormControl('', [ Validators.required ]),
    mission_content: new FormControl('', [ Validators.required ]),
    mission_banner: new FormControl('', [ Validators.required ]),
    innovation_title: new FormControl('', [ Validators.required ]),
    innovation_icon: new FormControl('', [ Validators.required ]),
    innovation_content: new FormControl('', [ Validators.required ]),
    innovation_banner: new FormControl('', [ Validators.required ]),
  })
  n(n) {
    return this.form.get(n);
  }

  whyUs;

  constructor(
    private contentManagerService: ContentManagerService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.whyChoseUsPage()
  }


  private whyChoseUsPage(){
    this.contentManagerService.getWhyChoseUs().subscribe(res => {
      console.log(res)
      if(res){
        this.whyUs = res.data;
        this.fillInput(this.whyUs);
      }
    })
  }


  private fillInput(res){
    this.form.get('id').setValue(res.id)
    this.form.get('small_title').setValue(res.small_title)
    this.form.get('main_title').setValue(res.main_title)
    this.form.get('btn_title').setValue(res.btn_title)
    this.form.get('btn_link').setValue(res.btn_link)
    this.form.get('content').setValue(res.content)
    this.form.get('mission_title').setValue(res.mission_title)
    this.form.get('mission_icon').setValue(res.mission_icon)
    this.form.get('mission_content').setValue(res.mission_content)
    this.form.get('mission_banner').setValue(res.mission_banner)
    this.form.get('innovation_title').setValue(res.innovation_title)
    this.form.get('innovation_icon').setValue(res.innovation_icon)
    this.form.get('innovation_content').setValue(res.innovation_content)
    this.form.get('innovation_banner').setValue(res.innovation_banner)

    this.uploadedBanners = res.mission_banner;
    this.uploadedBannersEdit = res.innovation_banner;
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.contentManagerService.updateWhyChoseUs(data).subscribe(res => {
      if(res){
        this.whyChoseUsPage();
        this.theMessage = "Why chose us successfully updated.";
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
      console.log(width)
      console.log(height)

      if(role == 'mainForm'){
        if(this.validateImage(width, height, 470, 631, 550, 739) === 'error'){
          this.bannerUploadErr = true
          return;
        };
      }

      if(role == 'updateForm'){
        if(this.validateImage(width, height, 470, 631, 550, 739) === 'error'){
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
    console.log("mann")
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
              this.form.get('mission_banner').setValue(event.body.secure_url);
              this.uploadedBanners = event.body.secure_url;
            } else {
              this.form.get('innovation_banner').setValue(event.body.secure_url);
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
