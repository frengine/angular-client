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
  }" id="float-picker"> <mat-slider [max]="sliderMax" [min]="sliderMin" (input)="sliderValue=$event.value" [value]="sliderBeginValue" [step]="sliderStepSize"></mat-slider>  </div> `,

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
  private editor: monaco.editor.IStandaloneCodeEditor = null;
  private correctedElementRange: monaco.Range = null;
  private lastEditText: string = null;

  public sliderMax: number
  public sliderMin: number
  public sliderStepSize: number
  public sliderBeginValue: number

  public set sliderValue(val: number) {
    let newValue: string = ""
    if (this.element.innerHTML.indexOf(".") != -1) { // if IsFloat
      let decimals: number = this.element.innerHTML.split(".")[1].length;
      newValue = Number(val).toFixed(decimals);
      if (decimals == 0) // 0. is valid in CG
        newValue += "."
    } else { // If isInt
      newValue = val.toFixed(0);
    }

    this.update({ range: this.correctedElementRange, text: newValue });    
  }

  constructor(private editorService: ShaderEditorService) { }
  ngOnInit() { }

  private setPosition(x:number, y:number) {
    this.left = x - this.width / 2;
    this.top = y + 15;
  }

  setPicker(e: monaco.editor.IEditorMouseEvent, editor: monaco.editor.IStandaloneCodeEditor) {
    this.show = true;

    this.element = e.target.element as HTMLElement; 
    this.editor = editor;
    this.setPosition(e.event.posx, e.event.posy);   

    this.lastEditText = this.element.innerHTML;
    let elementValue: number = Number(this.lastEditText);

    this.sliderMin = elementValue - 1;
    this.sliderMax = elementValue + 1;
    this.sliderBeginValue = elementValue;
    this.sliderStepSize = (this.lastEditText.indexOf(".") == -1)? 1 : 0.01;

    let correctedStartCollumn: number = this.getCorrectedStartCollumn(e.target.range);

    this.correctedElementRange = new monaco.Range(
      e.target.range.startLineNumber, // startLineNumber
      correctedStartCollumn, // startColumn 
      e.target.range.startLineNumber, // endLineNumber
      correctedStartCollumn + e.target.element.innerHTML.length, // endColumn
    )
  }

  private getCorrectedStartCollumn(range: monaco.Range) {
    let codeTextLine: string = this.editorService.getReadOnlyShaderText().split("\n")[range.startLineNumber - 1];
    let i: number = range.startColumn;
    while (codeTextLine.charAt(i-1).match(/[0-9|.|-]/) != null && i >= 0) { i--; }
    return i + 1
  }

  private correctRange(newValue: string) {
    this.correctedElementRange = new monaco.Range( // We need to correct for the new length
      this.correctedElementRange.startLineNumber,
      this.correctedElementRange.startColumn,
      this.correctedElementRange.endLineNumber,
      this.correctedElementRange.endColumn + ((this.lastEditText != null)? (newValue.length - this.lastEditText.length) : 0)
    );
  }

  setActive(bool: boolean) {  
    if (this.show != bool) { // If we clicked away we need to save
      this.save({range: this.correctedElementRange, text: this.lastEditText})
    }

    this.show = bool;
  }

  update(edit: monaco.editor.IIdentifiedSingleEditOperation) {
    this.correctRange(edit.text);
    this.editor.getModel().applyEdits([edit]);
    this.editorService.onChange.emit()
    this.lastEditText = edit.text;
  }

  save(edit: monaco.editor.IIdentifiedSingleEditOperation) { // RIP DOES NOT WORK
    this.editor.executeEdits("sliderEdit", [edit]);
    this.editorService.onChange.emit()
  }
}