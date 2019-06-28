import {Component, OnInit} from '@angular/core';
import {Project, ProjectService} from './project.service';
import {DEFAULT_FRAG_CODE, DEFAULT_VERT_CODE, Shader} from '../interfaces/shader';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit {

  constructor(private router: Router, private projectService: ProjectService) {}

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
          project.shader = JSON.parse(rev["content"]) as Shader;
        }
        console.log(this.projects);
      }
    );
  }

  createNewProject() {
    const shader = {} as Shader;
    shader.fragSource = DEFAULT_FRAG_CODE;
    shader.vertSource = DEFAULT_VERT_CODE;
    this.projectService.create('random').subscribe((x) => {
      console.log(x);
      const projectId = x["projectID"];
      this.projectService.setContent(projectId, shader).subscribe((y) => {

        this.router.navigate(['/shader/' + x["projectID"]]);
      };
    });
  }

}
