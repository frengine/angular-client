import { Component, ViewChild, Input, Output, EventEmitter, OnChanges, DoCheck } from '@angular/core';
import { MonacoOptions, MonacoEditorComponent } from '@materia-ui/ngx-monaco-editor';
import { Shader } from 'src/app/interfaces/shader';
import * as monaco from 'monaco-editor';
import { CompileResult, LogEntry, Severity } from 'src/app/services/shader.service';

@Component({
  selector: 'app-shader-editor',
  templateUrl: './shader-editor.component.html',
  styleUrls: ['./shader-editor.component.scss']
})
export class ShaderEditorComponent implements DoCheck {

  @Input() shader: Shader // the shader to be edited.
  @Output() onChange: EventEmitter<any> = new EventEmitter()

  editorOptions: MonacoOptions = { theme: 'vs', language: 'c' };

  // these are 2 components that contain a monaco-editor:
  @ViewChild("vertEditor") vertEditorContainer: MonacoEditorComponent
  @ViewChild("fragEditor") fragEditorContainer: MonacoEditorComponent

  // these are the 2 monaco-editors:
  vertEditor: monaco.editor.IStandaloneCodeEditor
  fragEditor: monaco.editor.IStandaloneCodeEditor

  selectedTab: number

  private lastCompileResult: CompileResult

  ngDoCheck() {
    if (!this.vertEditor) {
      this.vertEditor = this.vertEditorContainer.editor
      if (this.vertEditor) this.vertEditor.onKeyUp(() => this.onCodeChanged())
      this.showErrorsAndWarnings(this.lastCompileResult)
    }
    if (!this.fragEditor) {
      this.fragEditor = this.fragEditorContainer.editor
      if (this.fragEditor) this.fragEditor.onKeyUp(() => this.onCodeChanged())
      this.showErrorsAndWarnings(this.lastCompileResult)
    }
  }

  showErrorsAndWarnings(compileResult: CompileResult) {
    this.showErrorsAndWarningsInEditor(compileResult.vert.log, this.vertEditor)
    this.showErrorsAndWarningsInEditor(compileResult.frag.log, this.fragEditor)
    this.lastCompileResult = compileResult
  }

  goTo(vertOrFrag: number, line: number) {
    let editor = vertOrFrag == 0 ? this.vertEditor : this.fragEditor

    editor.focus()
    editor.setPosition({

      column: 1, lineNumber: line

    })
    editor.revealLine(line)

    this.selectedTab = vertOrFrag
  }

  private prevErrAndWarnDecorations: { [editorId: string]: any[] } = {}

  private showErrorsAndWarningsInEditor(log: LogEntry[], editor: monaco.editor.IStandaloneCodeEditor) {

    if (!editor) return // editor is not yet initialized

    // replace old error and warning decorations with new ones:
    this.prevErrAndWarnDecorations[editor.getId()] = editor.deltaDecorations(

      this.prevErrAndWarnDecorations[editor.getId()] || [],

      log.map(entry => {
        const className = entry.severity == Severity.ERROR ? 'editor-error' : 'editor-warning'
        return {

          range: new monaco.Range(entry.line, 1, entry.line, 1000),
          options: {
            isWholeLine: true,
            className,
            hoverMessage: { value: entry.message }
          }

        } as monaco.editor.IModelDeltaDecoration
      })

    )
  }

  tabChange(index: number) {
    (index == 0 ? this.vertEditor : this.fragEditor).focus()
  }

  private onCodeChanged() {
    this.onChange.emit()
  }

}
