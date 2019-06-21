import {Component, OnInit} from '@angular/core';
import {ProjectService, Project} from '../project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class NewProjectComponent implements OnInit {

  constructor(private projectService: ProjectService) {}

  projects: Project[];

  ngOnInit() {
    this.showProjects();
  }

  showProjects() {
    console.log('show projects');
    this.projectService.getAll().subscribe(
      (data: Project[]) => {
        console.log(data);
        this.projects = data;
      }
    );
  }

}
