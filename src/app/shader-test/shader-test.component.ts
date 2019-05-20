import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-shader-test',
  templateUrl: './shader-test.component.html',
  styleUrls: ['./shader-test.component.scss']
})
export class ShaderTestComponent implements OnInit {

  gl = <WebGLRenderingContext|null> null;

  constructor() {
  }

  ngOnInit() {
    this.runWebGl();
  }

  randomColor() {
    this.gl.clearColor(Math.random(), Math.random(), Math.random(), 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  runWebGl() {
    this.gl = (<HTMLCanvasElement>document.querySelector('#glCanvas')).getContext('webgl');

    if (this.gl === null) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }

    this.gl.clearColor(1.0, 0.0, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  shader() {
    console.log('Its shader time');
    // Vertex Shader
    const vertCode =
      'attribute vec2 a_position;' +

      'void main(void) {' +
      ' gl_Position = vec4(a_position, 0, 1);' +
      '}';
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, vertCode);
    this.gl.compileShader(vertexShader);

    // Fragment Shader
    const fragCode = String((<HTMLInputElement>document.getElementById('text-inp')).value);
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
