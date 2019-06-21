import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user';


@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  async getAll(): Promise<User[]> {
    return await this.http.get<User[]>(`http://localhost:/4000/users`).toPromise();
  }
}
