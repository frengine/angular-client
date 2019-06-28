import {Component, ViewChild, Input, Output, EventEmitter, DoCheck, OnInit, HostListener} from '@angular/core';
import { MonacoOptions, MonacoEditorComponent } from '@materia-ui/ngx-monaco-editor';
import { Shader } from 'src/app/interfaces/shader';
import * as monaco from 'monaco-editor';
import { CompileResult, LogEntry, Severity } from 'src/app/services/shader.service';
import { FloatPickerComponent } from 'src/app/components/code-pickers/float-picker.component';
import { ShaderEditorService } from 'src/app/services/shader-editor.service';
import {Project, ProjectService} from '../../project/project.service';
import {Router} from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-shader-editor',
  templateUrl: './shader-editor.component.html',
  styleUrls: ['./shader-editor.component.scss']
})
export class ShaderEditorComponent implements DoCheck, OnInit {

  @Input() shader: Shader; // the shader to be edited.
  @Input() project: Project;
  @Input() editName = false;

  @Output() onChange: EventEmitter<any>;

  constructor(
      public editorService: ShaderEditorService,
      private projectService: ProjectService,
      private router: Router,
      private snackbar: MatSnackBar
  ) {
    this.onChange = editorService.onChange;
  }

  ngOnInit() {
    this.editorService.shader = this.shader;
    window["shaderEditor"] = this
  }

  editorOptions: MonacoOptions = { 
    theme: 'vs-dark', // !!! LETOP NIET VERANDEREN !!! pickups gebruiken de css classen die dit thema genereerd
    language: 'c',
    automaticLayout: true
  };

  // these are 2 components that contain a monaco-editor:
  @ViewChild("vertEditor") vertEditorContainer: MonacoEditorComponent
  @ViewChild("fragEditor") fragEditorContainer: MonacoEditorComponent

  // these are the 2 monaco-editors:
  vertEditor: monaco.editor.IStandaloneCodeEditor
  fragEditor: monaco.editor.IStandaloneCodeEditor

  @ViewChild('floatPicker') floatPicker : FloatPickerComponent; 

  private lastCompileResult: CompileResult

  ngDoCheck() {
    if (!this.vertEditor) {
      this.vertEditor = this.vertEditorContainer.editor
      if (this.vertEditor) {
        this.vertEditor.onMouseDown(e => {this.updatePickers(e)});
        this.vertEditor.onKeyUp(() => this.onCodeChanged());
      }
      this.showErrorsAndWarnings(this.lastCompileResult)
    }
    if (!this.fragEditor) {
      this.fragEditor = this.fragEditorContainer.editor
      if (this.fragEditor) {
        this.fragEditor.onMouseDown(e => {this.updatePickers(e)});
        this.fragEditor.onKeyUp(() => this.onCodeChanged())
      }
      this.showErrorsAndWarnings(this.lastCompileResult)
    }
  }

  updatePickers(e : monaco.editor.IEditorMouseEvent) {
    this.clearPickers();

    if (e.target.element.className === "mtk6" || e.target.element.className === "mtk7") { // FLOAT PICKER
      this.floatPicker.setPicker(e, this.getEditor(this.editorService.tabIndex));
    }
    
  }
  
  clearPickers() {
    this.floatPicker.setActive(false);
  }

  showErrorsAndWarnings(compileResult: CompileResult) {
    if (!compileResult) return
    this.showErrorsAndWarningsInEditor(compileResult.vert.log, this.vertEditor)
    this.showErrorsAndWarningsInEditor(compileResult.frag.log, this.fragEditor)
    this.lastCompileResult = compileResult
  }

  goTo(vertOrFrag: number, line: number) {
    this.editorService.tabIndex = vertOrFrag
    let editor = vertOrFrag == 0 ? this.vertEditor : this.fragEditor

    editor.focus()
    editor.setPosition({

      column: 1, lineNumber: line

    })
    editor.revealLine(line)
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
    this.clearPickers();
    this.editorService.tabIndex = index
    this.getEditor(index).focus()
  }

  private getEditor(index:number) {
    return index == 0 ? this.vertEditor : this.fragEditor;
  }

  private onCodeChanged() {
    this.clearPickers();
    this.onChange.emit()
  }

  @HostListener('window:keydown', ['$event']) // u_mouse
  onKeydown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && String.fromCharCode(e.which).toLowerCase() == "s") { // ctrl + s
      this.projectService.setContent(this.project.id, this.shader)
        .subscribe( (x) => {
          console.log("saveddd", x);
          this.snackbar.open("Saved", null, { duration: 2000 })
        });
      e.preventDefault()
    }
  }

  updateName() {
    this.editName = false;
    this.projectService.update(this.project)
      .subscribe((x) => {
        console.log(x);
      })
  }

  deleteProject() {
    confirm("Are you sure you want to delete this project?") && this.projectService.delete(this.project.id)
      .subscribe((x) => {
        this.router.navigate(['/']);
      });
  }
}
