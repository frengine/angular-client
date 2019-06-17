import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ShaderTestComponent } from './shader-test/shader-test.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';

import { MonacoEditorModule } from '@materia-ui/ngx-monaco-editor';
import { ShaderEditorComponent } from './components/shader-editor/shader-editor.component';
import { ShaderViewerComponent } from './components/shader-viewer/shader-viewer.component';
import { ShaderLogViewerComponent } from './components/shader-log-viewer/shader-log-viewer.component';
import { FloatPickerComponent } from './components/code-pickers/float-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
