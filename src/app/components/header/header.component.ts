import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  headerText = 'Niet ingelogd';

  constructor() { }

  ngOnInit() {
    this.showUsername();
  }

  showUsername() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.headerText = `Welcome ${storedUsername}`;
    }
  }

}
