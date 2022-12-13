import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ContentManagerService } from 'src/app/data/services/administrator/content-manager.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';

@Component({
  selector: 'app-our-client',
  templateUrl: './our-client.component.html',
  styleUrls: ['./our-client.component.scss']
})
export class OurClientComponent implements OnInit {

  isLoading = true;
  isSubmitting = false;
  isUpdating = false;
  isDeleting = false;
  clients = [];

  uploadedBanners = '';
  uploadedBannersEdit = '';

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  closeModal = new BehaviorSubject(false);

  form = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    logo: new FormControl('', [ Validators.required ]),
  })
  n(n) {
    return this.form.get(n);
  }

  constructor(
    private contentManagerService: ContentManagerService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.allClients()
  }

  private allClients(){
    this.contentManagerService.getOurClient().subscribe(res => {
      if(res){
        this.clients = res.data;
      }
    })
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.contentManagerService.addOurClient(data).subscribe(res => {
      if(res){
        this.allClients();
        this.theMessage = "Client successfully added.";
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

      if(this.validateImage(width, height, 0, 0, 320, 304) === 'error'){
        this.bannerUploadErr = true
        return;
      };
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
            this.form.get('logo').setValue(event.body.secure_url);
            this.uploadedBanners = event.body.secure_url;

            this.bannerUploadErr = false;
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


  returnID;
  deleteClient(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this client?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.contentManagerService.deleteOurClient(id).subscribe(res => {
        if (res.data) {
          this.allClients();
          this.theMessage = "Client deleted successfully.";
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
