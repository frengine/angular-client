import {Component, OnInit} from '@angular/core';
import {Project, ProjectService} from './project.service';
import {Shader} from '../interfaces/shader';

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
          const rev = project.revision;
          project.shader = JSON.parse(rev.content) as Shader;
        }
        console.log(this.projects);
      }
    );
  }

}
