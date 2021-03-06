import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../login/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerText = 'Not logged in';

  constructor(public loginService: AuthService) {
  }

  ngOnInit() {
    this.showUsername();
    this.loginService.userSubject.subscribe((x) => {
      console.log(x);
      this.showUsername(x.name);
    });
  }

  showUsername(name = null) {
    if (name == null) {
      name = localStorage.getItem('username');
    }
    if (name) {
      this.headerText = `Welcome ${name}`;
    }
  }

}
