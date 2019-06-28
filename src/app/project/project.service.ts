import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Shader} from '../interfaces/shader';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

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
  revision: object;
  shader: Shader;
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

  fetchContentById(id: Number) {
    return this.http.get<any>(`${this.baseURL}/${id}/revision`);
  }

  setContent(id: Number, data: Shader) {
    const bodyString = JSON.stringify(data);
    return this.http.post<any>(`${this.baseURL}/${id}/revision`, bodyString);
  }

  create(name: string) {
    return this.http.post(`${this.baseURL}`, {name});
  }

  update(project: Project) {
    let p = {} as Project;
    p.name = project.name;
    return this.http.put(`${this.baseURL}/${project.id}`, p);
  }

  delete(id: Number) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }
}
