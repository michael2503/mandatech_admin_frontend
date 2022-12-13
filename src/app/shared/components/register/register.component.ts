import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Input() isModal;
  @Output() modalEv = new EventEmitter();

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })
  
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login() {
    if (this.isModal) {
      this.modalEv.emit('login');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  submit() {
    console.log(this.form.value);
  }

}
