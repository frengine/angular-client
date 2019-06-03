import { Component, OnInit, ViewChild } from '@angular/core';
import { MonacoOptions, MonacoEditorComponent } from '@materia-ui/ngx-monaco-editor';

@Component({
  selector: 'app-shader-editor',
  templateUrl: './shader-editor.component.html',
  styleUrls: ['./shader-editor.component.scss']
})
export class ShaderEditorComponent implements OnInit {

  editorOptions: MonacoOptions = { theme: 'vs', language: 'c' };
  code = 'test\n';

  @ViewChild("monaco") monaco: MonacoEditorComponent

  constructor() { }

  ngOnInit() {
  }

}
