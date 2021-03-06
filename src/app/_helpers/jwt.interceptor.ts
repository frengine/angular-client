import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../login/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
	  console.log(this.auth.currentUser)
    // add authorization header with jwt token if available
    if (!(this.auth.currentUser && this.auth.currentUser.token)) {
	    return next.handle(request)
    }

	const req1 = request.clone({
		headers: request.headers.set('Authorization', 'Bearer ' + this.auth.currentUser.token),
	});

	return next.handle(req1);
  }
}
