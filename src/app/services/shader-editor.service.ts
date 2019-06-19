import { Injectable, EventEmitter, } from '@angular/core';
import { Shader } from 'src/app/interfaces/shader';


@Injectable({
  providedIn: 'root'
})
export class ShaderEditorService {
  
  onChange: EventEmitter<any> = new EventEmitter()
  shader: Shader // the shader to be edited.
  tabIndex: number = 0

  constructor() { }

  getReadOnlyShaderText() {
    return (this.tabIndex == 0) ? this.shader.vertSource : this.shader.fragSource;
  }
}
