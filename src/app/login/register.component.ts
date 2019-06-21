import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from './auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  username = new FormControl('');
  password = new FormControl('');
  password2 = new FormControl('');

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSubmit() {
    if (this.password.value !== this.password2.value) {
      alert('Password does\'t match');
    }
    this.authService.register(this.username.value, this.password.value);
  }

}
