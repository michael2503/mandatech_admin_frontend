import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/data/services/auth.service';
import { ConfigService } from 'src/app/data/services/config.service';

@Component({
  selector: 'app-picture-details',
  templateUrl: './picture-details.component.html',
  styleUrls: ['./picture-details.component.scss']
})
export class PictureDetailsComponent implements OnInit {
  auth;
  confirmAtrModal = false;
  attrModal = false;
  @Input() picDetails = {
    image: 'assets/images/picDetails.png',
    title: 'Clean minimal BMW sport car',
    created_at: '07-09-2021',
    pngLink: 'assets/images/picDetails.png',
    jpgLink: 'assets/images/picDetails.png',
    sellerInfo: {
      name: 'Alexandra Necula',
      hire_availability: 'Available',
      photo: 'assets/images/userBig.png',
      resources: 80000,
    },
    sameProducts: [
      {
        image: 'assets/images/20.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/21.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/22.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/23.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/24.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/25.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/13.jpg',
        width: 664,
        height: 276,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Premium',
      },
      {
        image: 'assets/images/14.jpg',
        width: 664,
        height: 239,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/15.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/16.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/17.jpg',
        width: 338,
        height: 338,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/18.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Premium',
      },
      {
        image: 'assets/images/19.jpg',
        width: 664,
        height: 286,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/20.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/21.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/22.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/23.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/24.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/25.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/13.jpg',
        width: 664,
        height: 276,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Premium',
      },
      {
        image: 'assets/images/14.jpg',
        width: 664,
        height: 239,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/15.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/16.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/17.jpg',
        width: 338,
        height: 338,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
      {
        image: 'assets/images/18.jpg',
        width: 664,
        height: 442,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Premium',
      },
      {
        image: 'assets/images/19.jpg',
        width: 664,
        height: 286,
        user: 'Alexandra Necula',
        downloads: 150,
        likes: 200,
        isLiked: 0,
        photo: 'assets/images/user.png',
        licence: 'Free',
      },
    ]
  }

  @Output() selPicEv = new EventEmitter();

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
    });
  }

  downloadImg(img) {
    this.confirmAtrModal = true;
  }

  showDetails(data) {
    this.selPicEv.emit(data);
  }

  changeFav(e, pic) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    if (!this.auth) {
      this.authService.authModal.next(true);
    }
  }

  toggleCollection(e, pic) {
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.preventDefault();
    if (!this.auth) {
      this.authService.authModal.next(true);
    }
  }

  treatImgUrl(url) {
    return this.configService.treatImgUrl(url);
  }

}
