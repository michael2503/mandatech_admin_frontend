import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { StorageService } from 'src/app/data/helpers/storage.service';
import { ProductManagerService } from 'src/app/data/services/administrator/product-manager.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { FileUploadService } from 'src/app/data/services/file-upload.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  form: FormGroup;
  moreFaq: FormArray;

  categories = [];

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  get moreFaqFormGroup() {
    return this.form.get('moreFaqs') as FormArray;
  }

  proID;
  product;

  constructor(
    private productManagerService: ProductManagerService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.formHandler();
    this.getCategory();

    this.proID = this.route.snapshot.paramMap.get('id');

    this.singleProduct();
  }


  private singleProduct(){
    this.productManagerService.singleProduct(this.proID).subscribe(res => {
      if(res){
        this.product = res.data;

        this.form.get('id').setValue(this.product.id);
        this.form.get('name').setValue(this.product.name);
        this.form.get('category').setValue(this.product.category);
        this.form.get('old_price').setValue(this.product.old_price);
        this.form.get('sales_price').setValue(this.product.sales_price);
        this.form.get('status').setValue(this.product.status);
        this.form.get('description').setValue(this.product.description);
        this.form.get('sku').setValue(this.product.sku);
        this.form.get('quantity').setValue(this.product.quantity);
        this.form.get('overview').setValue(this.product.overview);

        if (this.product.images && !this.featuredIMG) {
          const imgs = JSON.parse(this.product.images);
          for (let i = 0; i < imgs.length; i++) {
            if (imgs[i].primary) {
              this.featuredIMG = imgs[i].original_url;
            }
            this.itemImages.push(imgs[i]);
          }
        }

        if (this.product.specifications) {
          const specs = JSON.parse(this.product.specifications);
          console.log(specs)
          this.removeFaq(0);
          for (let i = 0; i < specs.length; i++) {
            this.moreFaq.push(this.updateFaq(specs[i]));
          }
        }
      }
    })
  }


  private formHandler() {
    this.form = this.fb.group({
      name: new FormControl('', [
        Validators.required
      ]),
      category: new FormControl('', [
        Validators.required
      ]),
      old_price: new FormControl('', []),
      sales_price: new FormControl('', [
        Validators.required
      ]),
      sku: new FormControl('', [
        Validators.required
      ]),
      quantity: new FormControl('', [
        Validators.required
      ]),
      overview: new FormControl('', [
        Validators.required
      ]),
      feature_img: new FormControl('', []),
      images: new FormControl('', []),
      description: new FormControl('', []),
      status: new FormControl('', []),
      id: new FormControl('', []),

      moreFaqs: this.fb.array([this.createMoreFaq()]),
    });
    this.moreFaq = this.form.get('moreFaqs') as FormArray;
  }

  n(n) {
    return this.form.get(n);
  }


  createMoreFaq(): FormGroup {
    return this.fb.group({
      name: [],
      value: [null],
    });
  }

  updateFaq(obj): FormGroup {
    return this.fb.group({
      name: obj.name,
      value: obj.value,
    });
  }

  addFaq() {
    if (this.moreFaq.length < 10) {
      this.moreFaq.push(this.createMoreFaq());
    } else {
      alert('Welcome Bonus can not exceed 10!');
    }
  }

  removeFaq(index) {
    this.moreFaq.removeAt(index);
  }

  private getCategory(){
    this.productManagerService.getCategory().subscribe(res => {
      if(res){
        this.categories = res.data;
      }
    })
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



  itemImages: any[] = [];
  fileUploadError: string;
  uploadingProgress = 0;
  selectedFileName: string;
  featuredIMG: string;

  // file upload
  onSelectedFile(event) {
    this.fileUploadError = null;
    if (this.itemImages.length >= 9 ) {
      this.fileUploadError = 'Oops. You can only upload maximum of 8 Images';
      return;
    }
    const selectedFile = <File>event.target.files[0];

    if (this.validateFile(selectedFile) === 'upload') {
      this.uploadingProgress = 1;
      this.fileUploadError = null;
      const fd = new FormData;
      fd.append('file', selectedFile, selectedFile.name);

      this.fileUploadService.cloudUpload(
        fd, 'products', this.getFileName(selectedFile), 1, 330, 220, 2000, 4000
      ).subscribe(fielEvent => {
        if (fielEvent.type === HttpEventType.UploadProgress) {
          this.uploadingProgress = Math.round(fielEvent.loaded / fielEvent.total * 100 );
        } else if (fielEvent.type === HttpEventType.Response) {
          if (fielEvent.body.secure_url) {
            // this.itemImages.push(fielEvent.body.secure_url);
            this.itemImages.push({"original_url":"" + fielEvent.body.secure_url + ""});
            // this.saveContinue(true);
            this.selectedFileName = null;
          } else if (fielEvent.body.status === 'failed') {
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


  private validateFile(selectedFile) {
    const name = selectedFile ? selectedFile.name : null;
    this.selectedFileName = selectedFile ? selectedFile.name : null;
    const size = Number(selectedFile ? selectedFile.size : 0);
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

  setPrimary(index) {
    this.itemImages[index]['primary'] = true;
    this.storageService.storeData(
      'itemImages', JSON.stringify(this.itemImages)
    );
    this.form.get('feature_img').setValue(this.itemImages[index].original_url);
    this.featuredIMG = this.itemImages[index].original_url;
  }

  remove(index) {
    const x = 'Are you sure you want to REMOVE this Image?';
    const request = this.itemImages[index].original_url;
    if (request === this.featuredIMG) {
      alert('Oops! You can not remove PRIMARY image');
    } else {
      if (confirm(x)) {
        this.itemImages.splice(index, 1);
      }
    }
  }


  isSubmitting = false;
  submit(){
    this.form.get('images').setValue(JSON.stringify(this.itemImages));
    const featureImg = this.form.get('feature_img').value;
    if (!featureImg || featureImg == '') {
      this.form.get('feature_img').setValue(this.itemImages[0].original_url);
    }
    // if (this.form.invalid) return;
    this.isSubmitting = true;
    const data = JSON.stringify(this.form.value);
    this.productManagerService.updateProduct(data).subscribe(res => {
      console.log(res);
      if(res){
        this.theMessage = "Product successfully updated.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
      }
      this.isSubmitting = false;
    }, err => {
      this.isSubmitting = false;
    });
  }

  generateSKU(){
    let name = this.form.get('name').value;
    let charac = this.configService.getRandomString(10);
    if(name){
      const allName = name.replace(/\s+/g, '').replace(/\s*,\s*/g, '');
      const firstThree = allName.substring(0, 3).toUpperCase();
      const lastTwo = allName.slice(allName.length - 2).toUpperCase();
      this.form.get('sku').setValue(firstThree + charac + lastTwo);
    } else {
      alert("Please enter product name first");
    }
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


}
