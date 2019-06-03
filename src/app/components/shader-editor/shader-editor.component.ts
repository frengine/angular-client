import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, DoCheck } from '@angular/core';
import { MonacoOptions, MonacoEditorComponent } from '@materia-ui/ngx-monaco-editor';
import { Shader } from 'src/app/interfaces/shader';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-shader-editor',
  templateUrl: './shader-editor.component.html',
  styleUrls: ['./shader-editor.component.scss']
})
export class ShaderEditorComponent implements OnInit, DoCheck {

  @Input() shader: Shader
  @Output() onChange: EventEmitter<any> = new EventEmitter()
  
  editorOptions: MonacoOptions = { theme: 'vs', language: 'c' };

  // these are 2 components that contain a monaco-editor:
  @ViewChild("vertEditor") vertEditorContainer: MonacoEditorComponent
  @ViewChild("fragEditor") fragEditorContainer: MonacoEditorComponent

  // these are the 2 monaco-editors:
  vertEditor: monaco.editor.IStandaloneCodeEditor
  fragEditor: monaco.editor.IStandaloneCodeEditor

  constructor() { }

  ngOnInit() {
  }

  ngDoCheck() {
    if (!this.vertEditor) {
      this.vertEditor = this.vertEditorContainer.editor
      if (this.vertEditor) this.vertEditor.onKeyUp(() => this.onCodeChanged())
    }
    if (!this.fragEditor) {
      this.fragEditor = this.fragEditorContainer.editor
      if (this.fragEditor) this.fragEditor.onKeyUp(() => this.onCodeChanged())
    }
  }

  tabChange(index: number) {
    (index == 0 ? this.vertEditor : this.fragEditor).focus()
  }

  private onCodeChanged() {
    this.onChange.emit()
  }

}
