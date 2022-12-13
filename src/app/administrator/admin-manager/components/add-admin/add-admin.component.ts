import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../../../../data/services/config.service';
import { FileUploadService } from '../../../../data/services/file-upload.service';
import { HttpEventType } from '@angular/common/http';
import { AdminManagerService } from '../../../../data/services/administrator/admin-manager.service';
import { SEOService } from '../../../../data/services/seo.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss']
})
export class AddAdminComponent implements OnInit {
  isLoading = false;
  isAdding = false;

  uploadingProgress = 0;
  fileUploadError: any;

  theUploaded: '';
  removeLabel = true;

  showNotice = false;
  theMessage;
  justMssg = false;

  form = new FormGroup({
    full_name: new FormControl('', [
      Validators.required
    ]),
    username: new FormControl('', [
      Validators.required
    ]),
    email: new FormControl('', [
      Validators.required
    ]),
    Role: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
    phone: new FormControl('', []),
    photo: new FormControl('', []),
    address: new FormControl('', []),
    city: new FormControl('', []),
    state: new FormControl('', []),
    country: new FormControl('', []),
    bio: new FormControl('', []),
  });

  constructor(
    private configService: ConfigService,
    private fileUploadService: FileUploadService,
    private adminManagerService: AdminManagerService,
    private router: Router,
    private seoService: SEOService,
    private adminAuthService: AdminAuthService,
  ) { }

  ngOnInit() {
    this.updateAuth();
    this.seoUpdate();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        const data = this.configService.isRootAdmin(res);
        if (!data) {
          this.router.navigateByUrl('/' + this.adminUrl + '/dashboard');
        }
      }
    });
  }

  submit() {
    this.isAdding = true;
    const data = JSON.stringify(this.form.value);
    this.adminManagerService.createAdmin(data).subscribe(res => {
      if (res.data) {
        this.form.reset();
        this.theMessage = "Account created successfully";
        this.theUploaded = '';
        this.removeLabel = true;
        // this.router.navigateByUrl('/' + this.adminUrl + '/admin-manager');
      } else {
        this.theMessage = "Oops! Something went wrong. Ensure there is no duplicate Username or Email";
      }
      this.justMssg = true;
      this.isAdding = false;
    });
  }

  // file upload
  onSelectedFile(event) {
    this.removeLabel = false;
    this.fileUploadError = null;
    const selectedFile = <File>event.target.files[0];

    if (this.validateFile(selectedFile) === 'upload') {
      this.uploadingProgress = 1;
      this.fileUploadError = null;
      const fd = new FormData;
      fd.append('file', selectedFile, selectedFile.name);

      this.fileUploadService.cloudUpload(
        fd, 'administrators', this.getFileName(selectedFile), 0, 150, 150, 250, 250
      ).subscribe(fielEvent => {
        if (fielEvent.type === HttpEventType.UploadProgress) {
          this.uploadingProgress = Math.round(fielEvent.loaded / fielEvent.total * 100 );
        } else if (fielEvent.type === HttpEventType.Response) {
          if (fielEvent.body.secure_url) {
            this.form.get('photo').setValue(fielEvent.body.secure_url);
            this.theUploaded = fielEvent.body.secure_url;
            this.removeLabel = false;
          } else if (fielEvent.body.status === 'failed') {
            this.removeLabel = true;
            if (fielEvent.body.secure_url) {
              this.fileUploadError = fielEvent.body.secure_url;
            } else {
              this.fileUploadError = 'Oops! Something went wrong, we could not upload file';
            }
          }
          this.uploadingProgress = 0;
        }
      }, err => { console.log(err); }
      );
    }
  }

  removeUploadImg(){
    this.theUploaded = '';
    this.removeLabel = true;
  }

  private validateFile(selectedFile) {
    const name = selectedFile.name;
    const size = Number(selectedFile.size);
    const maxSize = 10000000;
    const ext = name.substring(name.lastIndexOf('.') + 1);

    if (ext.toLowerCase() !== 'png' &&
        ext.toLowerCase() !== 'jpeg' &&
        ext.toLowerCase() !== 'jpg' ) {
      this.fileUploadError = 'Selected file format is not supported';
      return this.fileUploadError;
    } else if (size > maxSize) {
      this.fileUploadError = 'Selected file Size exceeded the maximum required size of ' + maxSize;
      return this.fileUploadError;
    } else {
      return 'upload';
    }
  }

  private getFileName(selectedFile) {
    return selectedFile.name.split('.')[0];
  }

  private seoUpdate() {
    this.seoService.updateTitle('Add Admin');
    this.seoService.updateDescription('Add Admin');
  }

  removeNotice(){
    setTimeout(() => {
      if (this.showNotice = true) {
        this.showNotice = false;
      }
    }, 7000);
  }

  closeMyNotice(){
    this.showNotice = false;
  }

}
