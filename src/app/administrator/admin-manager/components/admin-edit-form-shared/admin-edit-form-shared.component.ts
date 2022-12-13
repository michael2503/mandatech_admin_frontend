import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigService } from '../../../../data/services/config.service';
import { FileUploadService } from '../../../../data/services/file-upload.service';
import { AdminManagerService } from '../../../../data/services/administrator/admin-manager.service';
import { HttpEventType } from '@angular/common/http';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-edit-form-shared',
  templateUrl: './admin-edit-form-shared.component.html',
  styleUrls: ['./admin-edit-form-shared.component.scss']
})
export class AdminEditFormSharedComponent implements OnInit {
  isLoading = false;
  isAdding = false;
  authAdmin: any;
  adm: any;
  admID: any;
  @Input() role: any;
  @Output() feeback: EventEmitter<string> = new EventEmitter();
  @Output() admInfo: EventEmitter<any> = new EventEmitter();


  theMessage: any;
  showNotice = false;
  justMssg = false;

  uploadingProgress = 0;
  fileUploadError: any;
  updateError: string;

  theUploaded: '';
  removeLabel = false;

  form = new FormGroup({
    full_name: new FormControl('', [
      Validators.required
    ]),
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', []),
    oldPass: new FormControl('', []),
    email: new FormControl('', [
      Validators.required
    ]),
    role: new FormControl('', [
      Validators.required
    ]),
    phone: new FormControl('', []),
    address: new FormControl('', []),
    city: new FormControl('', []),
    state: new FormControl('', []),
    country: new FormControl('', []),
    photo: new FormControl('', []),
    bio: new FormControl('', []),
    id: new FormControl('', []),
    status: new FormControl('', []),
  });

  constructor(
    private configService: ConfigService,
    private fileUploadService: FileUploadService,
    private adminManagerService: AdminManagerService,
    private router: Router,
    private adminAuthService: AdminAuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.updateAuth();
    this.getDetail();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private getDetail() {
    const admID = this.route.snapshot.paramMap.get('adm-id');
    if (admID) {
      this.admID = admID;
      this.adminManagerService.getSingle(admID).subscribe(res => {
        if (res.data) {
          this.adm = res.data;
          this.theUploaded = this.adm.photo;
          this.admInfo.emit(res.data);
          this.setValue(res.data);
        } else {
          this.router.navigateByUrl('/' + this.adminUrl + '/admin-manager');
        }
      });
    } else {
      this.updateAuth();
    }
  }

  private updateAuth() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.adm = res;
        this.authAdmin = res;
        if(this.adm.photo){
          this.theUploaded = this.adm.photo;
        } else {
          this.theUploaded = '';
          this.removeLabel = true;
        }
        this.setValue(res);
      }
    });
  }

  private setValue(adm) {
    this.form.get('full_name').setValue(adm.full_name);
    this.form.get('username').setValue(adm.username);
    this.form.get('email').setValue(adm.email);
    this.form.get('phone').setValue(adm.phone);
    this.form.get('oldPass').setValue(adm.password);
    this.form.get('address').setValue(adm.address);
    this.form.get('city').setValue(adm.city);
    this.form.get('state').setValue(adm.state);
    this.form.get('country').setValue(adm.country);
    this.form.get('photo').setValue(adm.photo);
    this.form.get('bio').setValue(adm.bio);
    this.form.get('id').setValue(adm.id);
    this.form.get('status').setValue(adm.status);
    this.form.get('role').setValue(adm.role);
  }

  submit() {
    this.isAdding = true;
    const data = JSON.stringify(this.form.value);
    this.adminManagerService.updateRecord(data, this.role).subscribe(res => {
      if (res) {
        this.updateError = null;
        this.sendFeedback('Updated Successfully!');
        this.theMessage = "Updated Successfully!"
        if (this.role === 'profile') {
          // this.adminAuthService.storeAdminAuthData(res.data);
        } else {
          this.router.navigateByUrl('/' + this.adminUrl + '/admin-manager');
        }
      } else {
        this.sendFeedback(null);
        this.theMessage = "Oops! Something went wrong. Ensure there is no duplicate Username or Email";
        this.updateError = 'Oops! Something went wrong. Ensure there is no duplicate Username or Email';
      }
      this.isAdding = false;
      this.showNotice = true;
      this.justMssg = true;
      this.removeNotice();
    });
  }

  // file upload
  onSelectedFile(event) {
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

  sendFeedback(feedback: string) {
    this.feeback.emit(feedback);
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
