import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <ul> 
        <li> <a href="/">home</a> </li>
        <li> <a href="/shader">shader</a> </li>
        <li> <a href="/login">login</a> </li>
    </ul>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  constructor() {}
  ngOnInit() {}
}