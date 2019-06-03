import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CompileResult, LogEntry } from 'src/app/services/shader.service';

@Component({
  selector: 'app-shader-log-viewer',
  templateUrl: './shader-log-viewer.component.html',
  styleUrls: ['./shader-log-viewer.component.scss']
})
export class ShaderLogViewerComponent {

  @Input()
  set compileResult(result: CompileResult) {
    this.logs = [
      {
        entries: result.vert.log,
        vertOrFrag: 0
      },
      {
        entries: result.frag.log,
        vertOrFrag: 1
      },
    ]
  }

  @Output() goTo: EventEmitter<{vertOrFrag: number, line: number}> = new EventEmitter()

  logs: {entries: LogEntry[], vertOrFrag: number}[] = []

}
