import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProjectComponent } from './project/project.component';
import {ShaderTestComponent} from './shader-test/shader-test.component';
import {RegisterComponent} from './login/register.component';
import {NewProjectComponent} from './project/new/newproject.component';
import {ProjectResolver} from './project/project.resolver';
import {ShaderResolver} from './project/shader.resolver';

const routes: Routes = [
  { path: '', component: ProjectComponent },
  { path: 'project/new', component: NewProjectComponent },
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'shader', component: ShaderTestComponent},
  {
    path: 'shader/:shaderId',
    component: ShaderTestComponent,
    resolve: {
      project: ProjectResolver,
      shader: ShaderResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
