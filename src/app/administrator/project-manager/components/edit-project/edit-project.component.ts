import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ProjectManagerService } from 'src/app/data/services/administrator/project-manager.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss']
})
export class EditProjectComponent implements OnInit {

  isLoading = true;
  isSubmitting = false;
  isUpdating = false;
  isDeleting = false;
  banners = [];

  uploadedBanners = '';
  uploadedBannersEdit = '';

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  form = new FormGroup({
    id: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    service: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    image: new FormControl('', []),
  })

  n(n) {
    return this.form.get(n);
  }

  constructor(
    private projectManagerService: ProjectManagerService,
    private fileUploadService: FileUploadService,
    private generalSettingsService: GeneralSettingsService,
    private route: ActivatedRoute,
  ) { }

  proID;
  project;

  ngOnInit(): void {
    this.proID = this.route.snapshot.paramMap.get('id');
    this.genSettings();
    this.singleProduct();
  }

  services = [];

  private genSettings(){
    this.generalSettingsService.genSettings.subscribe(res => {
      if(res){
        this.services = res.services
      }
    })
  }

  private singleProduct(){
    this.projectManagerService.getSingle(this.proID).subscribe(res => {
      if(res){
        this.project = res.data;
        this.fillAllnput(this.project);
      }
    })
  }

  private fillAllnput(res){
    this.form.get('title').setValue(res.title);
    this.form.get('service').setValue(res.service);
    this.form.get('content').setValue(res.content);
    this.form.get('image').setValue(res.image);
    this.form.get('id').setValue(res.id);
    this.uploadedBanners = res.image;
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.projectManagerService.updateProject(data).subscribe(res => {
      if(res){
        this.theMessage = "Project successfully updated.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        // this.uploadedBanners = '';
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

  onloadFile(eventAlt) {
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

      // if(this.validateImage(width, height, 500, 358, 852, 611) === 'error'){
      //   this.bannerUploadErr = true
      //   return;
      // };

      this.uploadFile(selectedFile, 'service', 1, 1, 1000, 1000);
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
      fd, 'projects', name
    )
    .subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadingProgress = Math.round(event.loaded / event.total * 100 );
        } else if (event.type === HttpEventType.Response) {
          if (event.body.secure_url) {
            this.form.get('image').setValue(event.body.secure_url);
            this.uploadedBanners = event.body.secure_url;

            this.bannerUploadErr = false
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

  // removeLabelBannerEdit = true;
  // removeUploadBannerEdit(){
  //   this.uploadedBannersEdit = '';
  //   this.removeLabelBannerEdit = true;
  // }


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
