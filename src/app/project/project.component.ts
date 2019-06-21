import { Component, OnInit } from '@angular/core';
import { ProjectService } from './project.service';


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

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

	constructor(private projectService: ProjectService) { }

	projects: Project[]

	ngOnInit() {
		this.showProjects()
	}

	showProjects() {
		console.log("show projects")
		this.projectService.getAll().subscribe(
			resp => this.projects
		)
	}

}
