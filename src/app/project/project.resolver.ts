import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Project, ProjectService } from './project.service';

@Injectable()
export class ProjectResolver implements Resolve<Project> {
  constructor(
    private projectService: ProjectService,
    private router: Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
      return this.projectService.find(route.params.shaderId).toPromise().catch(e => {
        this.router.navigateByUrl("/not-found")
      });
  }
}
