import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, map, mapTo, tap} from 'rxjs/operators';
import {Tokens} from './tokens';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private readonly NAME_JWT_TOKEN = 'JWT_token';
  private baseUrl = '';
  private loggedUser: string;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post(this.baseUrl + '/auth/login', {
      login: username,
      password: password
    }).pipe(
      tap(tokens => this.loginUser(username, tokens)),
      mapTo(true)
    );
  }

  logout(userId: string, tokens: Tokens): Observable<any> {
    return this.http.post(this.baseUrl + '/auth/logout', {
      userId: userId,
      token: tokens.jwt
    }).pipe(
      tap(() => this.logoutUser()),
    );
  }

  private loginUser(username: string, data: any) {
    if (data.success !== true) {
      alert('Login failed');
      console.log(username)
      console.log(data)
      return;
    }
    this.loggedUser = username;
    localStorage.setItem('username', username);
    this.storeJwtTokens(data.token);
  }

  private logoutUser() {
    this.loggedUser = null;
    localStorage.removeItem('username');
    this.deleteJwtTokens();
  }

  getJwtToken() {
    return localStorage.getItem(this.NAME_JWT_TOKEN);
  }

  private storeJwtTokens(token) {
    localStorage.setItem(this.NAME_JWT_TOKEN, token);
  }

  private deleteJwtTokens() {
    localStorage.removeItem(this.NAME_JWT_TOKEN);
  }

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
