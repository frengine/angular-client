import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  baseUrl = 'https://butje.remi.im:8083';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.baseUrl + '/auth/login', {
      login: username,
      password: password
    }).pipe(
      tap( _ => {})
    );
  }
}
