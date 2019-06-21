
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
uniform vec2 u_mouse;
uniform ivec2 u_resolution;

void main(void) {

	vec2 diff = gl_FragCoord.xy / vec2(u_resolution) - u_mouse;

	if (length(diff) < .1) {
		gl_FragColor = vec4(1, 0, 1, 1);
		return;
	}

	gl_FragColor = vec4(abs(sin(u_time)) * 0.5, u_mouse.x, u_mouse.y, 1.0);
}
  
`
