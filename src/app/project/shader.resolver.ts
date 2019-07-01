import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { Shader } from '../interfaces/shader';

@Injectable()
export class ShaderResolver implements Resolve<Shader> {
  constructor(private projectService: ProjectService,
    private router: Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.projectService.fetchContentById(route.params.shaderId).toPromise().catch(e => {
      this.router.navigateByUrl("/not-found")
    });
  }
}
