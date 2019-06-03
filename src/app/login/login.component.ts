import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = new FormControl('');
  password = new FormControl('');

  constructor(private loginService: LoginService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.loginService.login(this.username.value, this.password.value)
      .subscribe(data => { console.log(data); });
  }

}
