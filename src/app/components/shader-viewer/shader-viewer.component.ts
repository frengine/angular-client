import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Shader } from 'src/app/interfaces/shader';
import { ShaderService, CompileResult } from 'src/app/services/shader.service';

@Component({
  selector: 'app-shader-viewer',
  templateUrl: './shader-viewer.component.html',
  styleUrls: ['./shader-viewer.component.scss']
})
export class ShaderViewerComponent implements OnInit, OnDestroy {

  @Input() shader: Shader
  @Output() onCompileResults: EventEmitter<CompileResult> = new EventEmitter()

  @ViewChild("glCanvas") glCanvas: ElementRef

  gl: WebGLRenderingContext
  shaderProgram: WebGLProgram

  interval = null
  startTime = null

  constructor(
    private shaderService: ShaderService
  ) {
    this.startTime = Date.now() / 1000;
    this.interval = setInterval(()=>this.render(), 20);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ngOnInit() {

    this.gl = this.glCanvas.nativeElement.getContext('webgl')

    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.')
      return
    }
    this.compileAndRender()
  }

  /**
   * Will compile and render (if compilation succeeded)
   */
  compileAndRender() {
    const result = this.shaderService.compile(this.shader, this.gl)

    console.log(result)
    this.onCompileResults.emit(result)
    
    if (result.vert.success && result.frag.success) {

      this.replaceProgram(result.program)
      this.render()
    } else {

      this.gl.deleteProgram(result.program)
    }
  }

  /**
   * Deletes the old shaderProgram and replaces it with the new one
   */
  replaceProgram(newProgram: WebGLProgram) {
    if (this.shaderProgram)
      this.gl.deleteProgram(this.shaderProgram)

    this.shaderProgram = newProgram
  }

  /**
   * Renders the frame using this.shaderProgram
   */
  render() {
    console.log("Render");

    this.gl.useProgram(this.shaderProgram);
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        1.0, -1.0,
        1.0, 1.0]),
      this.gl.STATIC_DRAW
    );
    
    const positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    
    const timeLocation = this.gl.getUniformLocation(this.shaderProgram, "u_time");
    this.gl.uniform1f(timeLocation, (Date.now() / 1000) - this.startTime)

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

}
