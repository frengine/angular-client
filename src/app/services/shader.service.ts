import { Injectable } from '@angular/core';
import { Shader } from '../interfaces/shader';

export interface CompileResult {
  program: WebGLProgram
  
  vert: ShaderCompileResult
  frag: ShaderCompileResult
}

export interface ShaderCompileResult {

  log: LogEntry[]
  logStr: string
  success: boolean

}

export enum Severity {
  ERROR, WARNING
}

export interface LogEntry {
  severity: Severity
  message: string
  line: number
}

@Injectable({
  providedIn: 'root'
})
export class ShaderService {

  constructor() { }

  /**
   * Tries to compile a shader.
   * Will return a CompileResult (eventually with compilation errors).
   * 
   * @param shader Source-code for the shader
   * @param gl     WebGL context
   */
  compile(shader: Shader, gl: WebGLRenderingContext): CompileResult {

    // Vertex Shader
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, shader.vertSource)
    gl.compileShader(vertexShader)

    // Fragment Shader
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, shader.fragSource)
    gl.compileShader(fragmentShader)

    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const vertResult: ShaderCompileResult = {
      log: [],
      logStr: gl.getShaderInfoLog(vertexShader),
      success: !!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)
    }
    vertResult.log = this.logEntriesFromLogString(vertResult.logStr)

    const fragResult: ShaderCompileResult = {
      log: [],
      logStr: gl.getShaderInfoLog(fragmentShader),
      success: !!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)
    }
    fragResult.log = this.logEntriesFromLogString(fragResult.logStr)

    // cleanup (compiled shaders are not needed anymore after the program is made):
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    return {
      program,
      vert: vertResult, frag: fragResult
    }
  }

  logEntriesFromLogString(logStr: string): LogEntry[] {

    return logStr.split("\n").map(entryStr => {
      return {

        severity: entryStr.startsWith("ERROR") ? Severity.ERROR : Severity.WARNING,

        message: entryStr.split(":").slice(3).join(":").trim(),

        line: Number(entryStr.split(":")[2])

      } as LogEntry
    }).filter(entry => !!entry.message); // filter out entries without message
  }

}
