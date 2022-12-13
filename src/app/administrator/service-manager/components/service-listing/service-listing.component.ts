import { Component, OnInit } from '@angular/core';
import { ServiceManagerService } from 'src/app/data/services/administrator/service-manager.service';

@Component({
  selector: 'app-service-listing',
  templateUrl: './service-listing.component.html',
  styleUrls: ['./service-listing.component.scss']
})
export class ServiceListingComponent implements OnInit {

  services = [];

  theMessage: any;
  showNotice = false;
  deleteModal = false;
  justMssg = false;

  isDeleting = false;

  constructor(
    private serviceManagerService: ServiceManagerService
  ) { }

  ngOnInit(): void {
    this.getAlService()
  }

  private getAlService(){
    this.serviceManagerService.getService().subscribe(res => {
      if(res){
        this.services = res.data;
      }
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

  returnID;
  deleteService(warning, id: number) {
    if (warning) {
      this.showNotice = true;
      this.deleteModal = true;
      this.justMssg = false;
      this.theMessage = "Are you sure you want to DELETE this service?";
      this.returnID = id;
    } else {
      this.isDeleting = true;
      this.serviceManagerService.deleteService(id).subscribe(res => {
        if (res.data) {
          this.getAlService();
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
