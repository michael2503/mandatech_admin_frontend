import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SEOService } from '../../../../data/services/seo.service';
import { AdminAuthService } from '../../../../data/services/admin-auth.service';
import { ConfigService } from 'src/app/data/services/config.service';
import { GeneralSettingsService } from 'src/app/data/services/general-settings.service';
import { SettingsManagerService } from 'src/app/data/services/administrator/settings-manager.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-nigeria-banks',
  templateUrl: './nigeria-banks.component.html',
  styleUrls: ['./nigeria-banks.component.scss']
})
export class NigeriaBanksComponent implements OnInit {
  isLoading: any;
  allBank: any;
  authAdmin: any;

  theMessage: any;
  showNotice = false;
  justMssg = false;
  deleteModal = false;

  closeModal = new BehaviorSubject(false);


  form = new FormGroup({
    account_name: new FormControl('', [
      Validators.required,
    ]),
    account_number: new FormControl('', [
      Validators.required,
    ]),
    bank: new FormControl('', [
      Validators.required,
    ]),
    account_type: new FormControl('', [
      Validators.required,
    ]),
  });

  formEdit = new FormGroup({
    account_name: new FormControl('', [
      Validators.required,
    ]),
    account_number: new FormControl('', [
      Validators.required,
    ]),
    bank: new FormControl('', [
      Validators.required,
    ]),
    id: new FormControl('', [
      Validators.required,
    ]),
    account_type: new FormControl('', []),
  });

  get account_name() {
    return this.form.get('account_name');
  }
  get account_number() {
    return this.form.get('account_number');
  }
  get bank() {
    return this.form.get('bank');
  }

  f(n){
    return this.formEdit.get('n');
  }

  constructor(
    private configService: ConfigService,
    private seoService: SEOService,
    private settingsManagerService: SettingsManagerService,
    private generalSettingsService: GeneralSettingsService,
    private adminAuthService: AdminAuthService,
  ) { }

  ngOnInit() {
    this.thisAdmin();
    this.getBank();
    this.seoUpdate();
  }

  get adminUrl() {
    return this.configService.adminURL;
  }

  private thisAdmin() {
    this.adminAuthService.admin.subscribe(res => {
      if (res) {
        this.authAdmin = res;
      }
    });
  }

  private getBank(){
    this.generalSettingsService.getGenSettings().subscribe(res => {
      if(res) {
        this.allBank = res.data.banks;
      }
    })
  }

  submit() {
    this.isLoading = true;
    const data = JSON.stringify(this.form.value);
    this.settingsManagerService.addBank(data).subscribe(res => {
      if (res) {
        this.getBank();
        this.theMessage = "Bank successfully! Added";
        this.showNotice = true;
        this.form.reset();
      } else {
        this.theMessage = "Oops! We could not add your request.";
      }
      this.isLoading = false;
      this.showNotice = true;
      this.justMssg = true;
      this.removeNotice();
    });
  }


  returnID;
  isDeleting = false;
  deleteSocail(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this bank info?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.settingsManagerService.deleteBank(id).subscribe(res => {
        if (res.data) {
          this.allBank = res.data;
          this.theMessage = "Bank successfully deleted.";
          this.showNotice = true;
          this.deleteModal = false;
          this.justMssg = true;
          this.removeNotice();
        }
        this.isDeleting = false;
      });
    }
  }


  private seoUpdate() {
    this.seoService.updateTitle('Bank Info');
    this.seoService.updateDescription('Bank Info');
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


  singleBank(id){
    const bankInfo = this.allBank.filter(res => res.id === parseInt(id))[0];
    this.formEdit.get('account_number').setValue(bankInfo?.account_number);
    this.formEdit.get('account_name').setValue(bankInfo?.account_name);
    this.formEdit.get('bank').setValue(bankInfo?.bank);
    this.formEdit.get('id').setValue(bankInfo?.id);
    this.formEdit.get('account_type').setValue(bankInfo?.account_type);
    console.log(bankInfo)
  }

  isUpdating = false;
  submitEdit(){
    if (this.formEdit.invalid) return;
    this.isUpdating = true;
    const data = JSON.stringify(this.formEdit.value);
    this.settingsManagerService.updateBank(data).subscribe(res => {
      if(res){
        this.allBank = res.data;
        this.theMessage = "Team member successfully updated.";
        this.showNotice = true;
        this.deleteModal = false;
        this.justMssg = true;
        this.removeNotice();
        this.closeModal.next(true);
      }
      this.isUpdating = false;
    })
  }

}
