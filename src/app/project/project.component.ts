import {Component, OnInit} from '@angular/core';
import {ProjectService, Project} from './project.service';
import {DEFAULT_FRAG_CODE, DEFAULT_VERT_CODE, Shader} from '../interfaces/shader';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit {

  constructor(private projectService: ProjectService) {}

  projects: Project[];

  ngOnInit() {
    this.showProjects();
  }

  showProjects() {
    console.log('show projects');
    this.projectService.fetchContentById(1).subscribe((r) => {
      console.log('jammer', r.content);
    });
    this.projectService.getAll().subscribe(
      (data: Project[]) => {
        this.projects = data;

        for (const project of this.projects) {
          project.shader = {} as Shader;
          project.shader.vertSource = DEFAULT_VERT_CODE;
          project.shader.fragSource = DEFAULT_FRAG_CODE;
        }
        console.log(this.projects);
      }
    );
  }

}
