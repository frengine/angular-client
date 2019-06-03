import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Shader } from 'src/app/interfaces/shader';

@Component({
  selector: 'app-shader-viewer',
  templateUrl: './shader-viewer.component.html',
  styleUrls: ['./shader-viewer.component.scss']
})
export class ShaderViewerComponent implements OnInit {

  @Input() shader: Shader

  @ViewChild("glCanvas") glCanvas: ElementRef

  gl: WebGLRenderingContext

  constructor() { }

  ngOnInit() {

    this.gl = this.glCanvas.nativeElement.getContext('webgl')

    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.')
      return
    }
    this.compile()
  }

  compile() {
    console.log('Its shader time');
    // Vertex Shader
    const vertCode = this.shader.vertSource;
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, vertCode);
    this.gl.compileShader(vertexShader);

    // Fragment Shader
    const fragCode = this.shader.fragSource;
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, fragCode);
    this.gl.compileShader(fragmentShader);
    const success = this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS);
    if (!success) { // If the shader is wrong we
      this.gl.clearColor(1.0, 0.0, 1.0, 1.0);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
      return;
    }
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    this.gl.useProgram(program);
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
    const positionLocation = this.gl.getAttribLocation(program, 'a_position');
    this.gl.enableVertexAttribArray(positionLocation);
    this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

}
