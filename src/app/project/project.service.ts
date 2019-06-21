import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}

@Injectable({
	providedIn: 'root'
})
export class ProjectService {
	constructor(private http: HttpClient) { }

	getAllURL = "/projects";

	getAll() {
		return this.http.get<Project[]>(this.getAllURL);
	}
}
