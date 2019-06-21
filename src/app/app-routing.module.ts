import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProjectComponent } from './project/project.component';
import {ShaderTestComponent} from './shader-test/shader-test.component';

const routes: Routes = [
  { path: '', component: ProjectComponent },
  { path: 'login', component: LoginComponent},
  { path: 'shader', component: ShaderTestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
