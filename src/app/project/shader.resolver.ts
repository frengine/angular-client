import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {ProjectService} from './project.service';
import {Shader} from '../interfaces/shader';

@Injectable()
export class ShaderResolver implements Resolve<Shader> {
  constructor(private projectService: ProjectService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.projectService.fetchContentById(route.params.shaderId); // TODO: Add request for content
  }
}
