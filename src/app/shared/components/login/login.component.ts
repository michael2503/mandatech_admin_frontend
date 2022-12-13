import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/data/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input() isModal;
  @Output() modalEv = new EventEmitter();
  @Output() closeModal = new EventEmitter();

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.form.value);
    const data = JSON.stringify(this.form.value);
    this.authService.login(data).subscribe(auth => {
      if (auth && auth.status == 'success') {
        if (this.isModal) {
          this.closeModal.emit();
        }
      }
    })
  }

  register() {
    if (this.isModal) {
      this.modalEv.emit('register');
    } else {
      this.router.navigateByUrl('/register');
    }
  }

}
