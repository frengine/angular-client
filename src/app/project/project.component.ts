import {Component, OnInit} from '@angular/core';
import {Project, ProjectService} from './project.service';
import {DEFAULT_FRAG_CODE, DEFAULT_VERT_CODE, Shader} from '../interfaces/shader';
import {Router} from '@angular/router';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent implements OnInit {

  constructor(private router: Router, private projectService: ProjectService, public loginService: AuthService) {}

  projects: Project[];

	splashProject: Project

  ngOnInit() {
	if (this.loginService.currentUser != null) {
		this.showProjects();
	} else {
		this.showSplash();
	}
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

	showSplash() {
		this.projectService.find(6).subscribe((p: Project) => {
			this.splashProject = p
			this.splashProject.shader = JSON.parse(p.revision["content"]) as Shader
			console.log("SHADER PROJECT")
			console.log(this.splashProject.shader)
		})
	}

  createNewProject() {
    const shader = {} as Shader;
    shader.fragSource = DEFAULT_FRAG_CODE;
    shader.vertSource = DEFAULT_VERT_CODE;
    this.projectService.create(prompt("enter a name")).subscribe((x) => {
      console.log(x);
      const projectId = x["projectID"];
      this.projectService.setContent(projectId, shader).subscribe((y) => {

        this.router.navigate(['/shader/' + x["projectID"]]);
      });
    });
  }

}
