import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Shader} from '../interfaces/shader';

export interface Author {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  author: Author;
  modtime: number;
  created: number;
  touched: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  private baseURL = '/api/projects';
  private getAllURL = '/api/projects';

  getAll() {
    return this.http.get<Project[]>(this.getAllURL);
  }

  find(id: Number) {
    return this.http.get<Project>(`${this.baseURL}/${id}`);
  }

  fetchContentByIf(id: Number) {
    return this.http.get<string>(`${this.baseURL}/${id}/revision`)
      .subscribe((response) => JSON.parse(response));
  }

  setContent(id: Number, data: Shader) {
    const bodyString = JSON.stringify(data);
    return this.http.post<any>(`${this.baseURL}/${id}/revision`, bodyString);
  }
}
