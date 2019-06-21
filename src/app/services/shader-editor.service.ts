import { Injectable, EventEmitter, } from '@angular/core';
import { Shader } from 'src/app/interfaces/shader';

export interface Uniform {
  type: string
  name: string
  description: string
  value: string | number
}

@Injectable({
  providedIn: 'root'
})
export class ShaderEditorService {
  
  onChange: EventEmitter<any> = new EventEmitter()
  shader: Shader // the shader to be edited.
  tabIndex: number = 0

  uniforms: {[name: string]: Uniform}

  get uniformArray(): Uniform[] {
    return Object.values(this.uniforms)
  }

  constructor() { }

  getReadOnlyShaderText() {
    return (this.tabIndex == 0) ? this.shader.vertSource : this.shader.fragSource;
  }
}
