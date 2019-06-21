import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

import {Observable, Subject, throwError} from 'rxjs';
import {catchError, map, mapTo, tap} from 'rxjs/operators';
import {Tokens} from './tokens';
import {User} from './user';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly NAME_JWT_TOKEN = 'JWT_token';
  private baseUrl = '';
  currentUser: User;
  userSubject = new Subject<User>();

  constructor(private http: HttpClient, private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  async login(login: string, password: string) {
    this.http.post<any>(this.baseUrl + '/auth/login', {login, password}).toPromise()
      .then((body) => {
        this.loginUser(login, body);
        console.log(body);
        this.router.navigate(['']);
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

  async register(name: string, password: string) {
    this.http.post<any>('/auth/register', {name, password, password2: password}).toPromise()
      .then((body) => {
        console.log('Register succeed');
        this.login(name, password);
      }).catch((e) => {
      console.log(e);
    });
  }

  private loginUser(username: string, data: any) {
    if (data.success !== true) {
      alert('Login failed');
      return;
    }
    const user = new User();
    user.id = data.user.id;
    user.name = data.user.name;
    user.token = data.token;
    this.currentUser = user;
    this.userSubject.next(this.currentUser);
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    localStorage.setItem('username', username);
  }

  private logoutUser() {
    this.currentUser = null;
    this.userSubject.next(this.currentUser);
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
