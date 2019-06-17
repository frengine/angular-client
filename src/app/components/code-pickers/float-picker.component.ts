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
  }" id="float-picker"> ZEER MOOI </div> `,

  styles: ['div { position:absolute; z-index:9999999; background:rgb(255,0,255); }']
})

export class FloatPickerComponent implements OnInit {
  private show: boolean = false;
  private width: number = 150
  private height: number = 50;
  private left: number = 0;
  private top: number = 0;
  private element = null

  constructor() { }
  ngOnInit() { }

  private setPosition(x:number, y:number) {
    this.left = x - this.width / 2;
    this.top = y + 15;
  }

  setPicker(e : monaco.editor.IEditorMouseEvent) {
    this.show = true;

    // Do not move if we have the picker already open for this variable
    this.element = e.target.element;
    this.setPosition(e.event.posx, e.event.posy);
  }

  setActive(bool: boolean) {
    this.show = bool;
  }
}
