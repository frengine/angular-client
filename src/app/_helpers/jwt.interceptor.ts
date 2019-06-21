import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginService } from '../login/login.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	  console.log(this.auth.currentUser)
    // add authorization header with jwt token if available
    if (this.auth.currentUser && this.auth.currentUser.token) {
      request.headers['Authorization'] = 'Bearer ' + this.auth.currentUser.token;
    }
    return next.handle(request);
  }
}
