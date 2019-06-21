
export interface Shader {

  vertSource: string
  fragSource: string

}

export const DEFAULT_VERT_CODE = `
attribute vec2 a_position;

void main(void) {
  gl_Position = vec4(a_position, 0, 1);
}
`

export const DEFAULT_FRAG_CODE = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main(void) {
	gl_FragColor = vec4(abs(sin(u_time)), 0.0, 0.0, 1.0);
}
`
