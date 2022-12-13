import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TestimonialManagerService } from 'src/app/data/services/administrator/testimonial-manager.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';
import { SEOService } from 'src/app/data/services/seo.service';

@Component({
  selector: 'app-edit-testimony',
  templateUrl: './edit-testimony.component.html',
  styleUrls: ['./edit-testimony.component.scss']
})
export class EditTestimonyComponent implements OnInit {

  isSubmitting = false;

  showNotice = false;
  theMessage;
  justMssg = false;

  form = new FormGroup({
    id: new FormControl('', [ Validators.required ]),
    full_name: new FormControl('', [ Validators.required ]),
    position: new FormControl('', [ Validators.required ]),
    photo: new FormControl('', [  ]),
    content: new FormControl('', [ Validators.required ]),
  })

  testID;
  test;

  constructor(
    private testimonialManagerService: TestimonialManagerService,
    private fileUploadService: FileUploadService,
    private seoService: SEOService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.testID = this.route.snapshot.paramMap.get('id');
    this.getSingleTest()
  }


  private getSingleTest(){
    this.testimonialManagerService.singleTestimony(this.testID).subscribe(res => {
      if(res){
        this.test = res.data;
        this.fillInputs(res.data);
      }
    })
  }

  private fillInputs(res){
    this.form.get('id').setValue(res.id);
    this.form.get('full_name').setValue(res.full_name);
    this.form.get('position').setValue(res.position);
    this.form.get('photo').setValue(res.photo);
    this.form.get('content').setValue(res.content);
    this.theUploaded = res.photo;
  }


  submit(){
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.testimonialManagerService.updateTestimony(data).subscribe(res => {
      if(res){
        this.ngOnInit();
        this.theMessage = "Testimony updated successfully!";
        this.justMssg = true;
        this.showNotice = true;
        this.form.reset();
      }
      this.isSubmitting = false;
    })
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


  uploadingProgress = 0;
  fileUploadError: any;

  theUploaded: '';
  removeLabel = true;

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
        fd, 'testimonial', this.getFileName(selectedFile), 0, 150, 150, 250, 250
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
    this.seoService.updateTitle('Edit Testimony');
    this.seoService.updateDescription('Edit Testimony');
  }

}
