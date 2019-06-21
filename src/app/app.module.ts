import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { ShaderTestComponent } from './shader-test/shader-test.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';

import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { ShaderEditorComponent } from './components/shader-editor/shader-editor.component';
import { ShaderViewerComponent } from './components/shader-viewer/shader-viewer.component';
import { ShaderLogViewerComponent } from './components/shader-log-viewer/shader-log-viewer.component';
import { FloatPickerComponent } from './components/code-pickers/float-picker.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ShaderTestComponent,
    HeaderComponent,
    ShaderEditorComponent,
    ShaderViewerComponent,
    ShaderLogViewerComponent,
    FloatPickerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MonacoEditorModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
