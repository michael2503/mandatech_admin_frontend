import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';

@Component({
  selector: 'app-each-pic',
  templateUrl: './each-pic.component.html',
  styleUrls: ['./each-pic.component.scss']
})
export class EachPicComponent implements OnInit {
  @Input() img;
  @Input() i;
  @Input() images;
  @Output() getDetEv = new EventEmitter();
  auth;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.getAuth();
  }

  private getAuth() {
    this.authService.user.subscribe(auth => {
      this.auth = auth;
    })
  }

  changeFav(e, pic) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    if (!this.auth) {
      this.authService.authModal.next(true);
    }
  }

  getPicDetails(e) {
    this.getDetEv.emit([e, this.img, this.i, this.images]);
  }

  treatImgUrl(url) {
    return this.configService.treatImgUrl(url);
  }

  toggleCollection(e, pic) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    if (!this.auth) {
      this.authService.authModal.next(true);
    }
  }

}
