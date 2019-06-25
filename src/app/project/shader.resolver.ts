import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Project, ProjectService} from './project.service';

@Injectable()
export class ShaderProjectResolver implements Resolve<Project> {
  constructor(private projectService: ProjectService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.projectService.find(route.params.shaderId); // TODO: Add request for content
  }
}
