
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
void main(void) {
  gl_FragColor = vec4(gl_FragCoord.x / 640.0, gl_FragCoord.y / 480.0, 0, 1);
}
`
