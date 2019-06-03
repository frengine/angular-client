import {Component, OnInit} from '@angular/core';
import { Shader, DEFAULT_FRAG_CODE, DEFAULT_VERT_CODE } from '../interfaces/shader';

@Component({
  selector: 'app-shader-test',
  templateUrl: './shader-test.component.html',
  styleUrls: ['./shader-test.component.scss']
})
export class ShaderTestComponent {

  shader: Shader = {
    fragSource: DEFAULT_FRAG_CODE,
    vertSource: DEFAULT_VERT_CODE
  }

}
