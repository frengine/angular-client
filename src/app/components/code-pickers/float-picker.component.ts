import { Component, OnInit } from '@angular/core';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-float-picker',
  template: `
   <div *ngIf="show"
   [ngStyle]="{
    'width.px': width,
    'height.px': height,
    'top.px': top, 
    'left.px': left
  }" id="float-picker"> TODO: slider </div> `,

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
  private updateCB: Function = null;

  constructor() { }
  ngOnInit() { }

  private setPosition(x:number, y:number) {
    this.left = x - this.width / 2;
    this.top = y + 15;
  }

  setPicker(e : monaco.editor.IEditorMouseEvent, cb: Function) {
    this.show = true;
    this.updateCB = cb;

    this.element = e.target.element as HTMLElement; 
    this.setPosition(e.event.posx, e.event.posy);

    let selectedRange = new monaco.Range(
      e.target.range.startLineNumber, // startLineNumber
      e.target.range.startColumn,     // startColumn 
      e.target.range.startLineNumber, // endLineNumber
      e.target.range.startColumn + e.target.element.innerHTML.length, // endColumn
    )

    console.log("You clicked to edit ", e, selectedRange);
      
    this.updateCB({
      range: selectedRange,
      text: (Number(e.target.element.innerHTML) + 1).toString()
    });
  }

  setActive(bool: boolean) {
    this.show = bool;
  }
}


// let selectedRange = new monaco.Range(
//   e.target.position.lineNumber, // startLineNumber
//   e.target.position.column-1,     // startColumn 
//   e.target.position.lineNumber, // endLineNumber
//   e.target.position.column + e.target.element.innerHTML.length -1, // endColumn
// )
