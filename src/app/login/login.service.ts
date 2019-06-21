import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {catchError, map, mapTo, tap} from 'rxjs/operators';
import {Tokens} from './tokens';
import {User} from './user';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private readonly NAME_JWT_TOKEN = 'JWT_token';
  private baseUrl = '';
  currentUser: User;

  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  async login(login: string, password: string) {
    const res = this.http.post<any>(this.baseUrl + '/auth/login', {login, password}).toPromise();
    res.then(() => {
      this.loginUser(login, res);
    }).catch((e) => {
      console.log(e);
    });
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
    // if (data.success !== true) {
    //   alert('Login failed');
    //   console.log(username);
    //   console.log(data);
    //   return;
    // }
    this.currentUser = data;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    localStorage.setItem('username', username);
  }

  private logoutUser() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('username');
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
