import { Component, OnInit } from '@angular/core';
import * as monaco from 'monaco-editor';
import { ShaderEditorService } from 'src/app/services/shader-editor.service';

@Component({
  selector: 'app-float-picker',
  template: `
   <div *ngIf="show"
   [ngStyle]="{
    'width.px': width,
    'height.px': height,
    'top.px': top, 
    'left.px': left
  }" id="float-picker"> <mat-slider [max]="sliderMax" [min]="sliderMin" (input)="sliderValue=$event.value" [value]="sliderBeginValue" [step]="0.01"></mat-slider>  </div> `,

  styles: [`
  div { 
    position: absolute;
    z-index: 1000;
    background: rgb(20, 20, 20);
    color: rgb(102, 102, 102);
    box-shadow: 2px 2px 5px 0px #000;
    border-radius: 5px;
    padding: 5px;

    text-align: center
  }`]
})

export class FloatPickerComponent implements OnInit {
  private show: boolean = false;
  private width: number = 150
  private height: number = 40;
  private left: number = 0;
  private top: number = 0;
  private element: HTMLElement = null;
  private editor : monaco.editor.IStandaloneCodeEditor = null;
  private correctedElementRange: monaco.Range = null;
  private oldTextLength: number = null;

  public sliderMax : number
  public sliderMin : number
  private sliderBeginValue : number

  public set sliderValue(val: number) {
    let newValue: string = ""
    if (this.element.innerHTML.indexOf(".") != -1) { // if IsFloat
      newValue = Number(val).toFixed(this.element.innerHTML.split(".")[1].length);
      if (this.element.innerHTML.indexOf(".") != -1) // 0. is valid in CG
        newValue += "."
    }
    newValue = Number(val).toString()

    this.update({ range: this.correctedElementRange, text: newValue })
    
    this.correctedElementRange = new monaco.Range( // We need to correct for the new length
      this.correctedElementRange.startLineNumber,
      this.correctedElementRange.startColumn,
      this.correctedElementRange.endLineNumber,
      this.correctedElementRange.endColumn + (newValue.length - this.oldTextLength)
    );

    this.oldTextLength = newValue.length
  }

  constructor(private editorService : ShaderEditorService) { }
  ngOnInit() { }

  private setPosition(x:number, y:number) {
    this.left = x - this.width / 2;
    this.top = y + 15;
  }

  setPicker(e : monaco.editor.IEditorMouseEvent, editor : monaco.editor.IStandaloneCodeEditor) {
    this.show = true;

    this.element = e.target.element as HTMLElement; 
    this.editor = editor;
    this.setPosition(e.event.posx, e.event.posy);   

    let elementValue: number = Number(this.element.innerHTML);
    this.oldTextLength = elementValue.toString().length

    this.sliderMin = elementValue - 1;
    this.sliderMax = elementValue + 1;
    this.sliderBeginValue = elementValue;

    let correctedStartCollumn: number = this.getCorrectedStartCollumn(e.target.range);

    this.correctedElementRange = new monaco.Range(
      e.target.range.startLineNumber, // startLineNumber
      correctedStartCollumn, // startColumn 
      e.target.range.startLineNumber, // endLineNumber
      correctedStartCollumn + e.target.element.innerHTML.length, // endColumn
    )
  }

  private getCorrectedStartCollumn(range : monaco.Range) {
    let codeTextLine: string = this.editorService.getReadOnlyShaderText().split("\n")[range.startLineNumber - 1];
    let i: number = range.startColumn;
    while (codeTextLine.charAt(i-1).match(/[0-9]|.|-/) == null && i >= 0) { i--; }
    return i
  }

  setActive(bool: boolean) {
    this.show = bool;
  }

  update(edit : monaco.editor.IIdentifiedSingleEditOperation) {
    this.editor.getModel().applyEdits([edit]);
    this.editorService.onChange.emit()
  }

  save(edit : monaco.editor.IIdentifiedSingleEditOperation) {
    // TODO
  }
}