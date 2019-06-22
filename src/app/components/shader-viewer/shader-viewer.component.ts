import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output, OnDestroy, HostListener } from '@angular/core';
import { Shader } from 'src/app/interfaces/shader';
import { ShaderService, CompileResult } from 'src/app/services/shader.service';
import { ShaderEditorService } from 'src/app/services/shader-editor.service';

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
  startTime = null // u_time
  mousePosX = null // u_mouse
  mousePosY = null
  screenWidth = null // u_resolution
  screenHeight = null

  constructor(
    private shaderService: ShaderService,
    private editorService: ShaderEditorService
  ) {
    this.startTime = Date.now() / 1000; // u_time
    this.interval = setInterval(()=>this.render(), 20);
  }

  @HostListener('window:mousemove', ['$event']) // u_mouse
  onmousemove(e) { 
    let rect: DOMRect = this.glCanvas.nativeElement.getBoundingClientRect();
    let x = Math.max(Math.min(e.x - rect.x, rect.width), 0) | 0;
    let y = Math.max(Math.min(e.y - rect.y, rect.height), 0) | 0;
    // console.log(rect, e, this.mousePosX, this.mousePosY);
    this.onResize(null);
    this.mousePosX = x / this.screenWidth;
    this.mousePosY = 1 - y / this.screenHeight;
  }

  @HostListener('window:resize', ['$event']) // u_resolution
  onResize(e) {
    let rect: DOMRect = this.glCanvas.nativeElement.getBoundingClientRect();
    this.screenWidth = rect.width | 0;
    this.screenHeight = rect.height | 0;
  }
  
  
  ngOnInit() {
    this.onResize(null);
    this.gl = this.glCanvas.nativeElement.getContext('webgl')
    
    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.')
      return
    }
    this.compileAndRender()
  }

  ngOnDestroy() {
    clearInterval(this.interval);
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

    this.a_positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_position');

    this.u_timeLocation = this.gl.getUniformLocation(this.shaderProgram, "u_time");
    this.u_mouseLocation = this.gl.getUniformLocation(this.shaderProgram, "u_mouse");
    this.u_resolutionLocation = this.gl.getUniformLocation(this.shaderProgram, "u_resolution");

    this.editorService.uniforms = {
      u_time: {
        name: "u_time",
        type: "float",
        description: "Time sinds start, in seconds",
        value: 0
      },
      u_mouse: {
        name: "u_mouse",
        type: "vec2",
        description: "Mouse position on screen, range 0 - 1",
        value: "(0, 0)"
      },
      u_resolution: {
        name: "u_resolution",
        type: "ivec2",
        description: "Screen resolution, in pixels",
        value: "(0, 0)"
      },
    }
  }

  a_positionLocation
  u_timeLocation; u_mouseLocation; u_resolutionLocation;
  
  /**
   * Renders the frame using this.shaderProgram
   */
  render() {
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

    this.gl.viewport(0, 0, this.screenWidth, this.screenHeight);
    
    this.gl.enableVertexAttribArray(this.a_positionLocation);
    this.gl.vertexAttribPointer(this.a_positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    const time = (Date.now() / 1000) - this.startTime;
    this.gl.uniform1f(this.u_timeLocation, time);
    this.editorService.uniforms.u_time.value = time.toFixed(2);
    this.gl.uniform2f(this.u_mouseLocation, this.mousePosX, this.mousePosY);
    this.editorService.uniforms.u_mouse.value = `(${this.mousePosX.toFixed(2)}, ${this.mousePosY.toFixed(2)})`
    this.gl.uniform2i(this.u_resolutionLocation, this.screenWidth, this.screenHeight);
    this.editorService.uniforms.u_resolution.value = `(${this.screenWidth}, ${this.screenHeight})`

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

}
