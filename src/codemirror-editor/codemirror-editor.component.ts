import { Component, ElementRef, ViewChild, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint';

@Component({
  selector: 'codemirror-editor',
  template: require('./codemirror-editor.component.html'),
  styles: [
    require('codemirror/lib/codemirror.css'),
    require('codemirror/addon/hint/show-hint.css'),
    require('./codemirror-editor.component.scss'),
  ],
  encapsulation: ViewEncapsulation.None
})
export class CodeMirrorEditorComponent implements OnChanges, AfterViewInit {
  private cm :any;
  private timeout;

  @Input() content: string;
  @Output() contentChange = new EventEmitter<string>();
  @ViewChild('editor') editor :ElementRef;

  constructor () {}

  ngAfterViewInit () {
    this.cm = CodeMirror.fromTextArea(this.editor.nativeElement, {
      viewportMargin: Infinity,
      lineWrapping: true,
      mode: 'gfm',
      extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList"
      }
    });

    this.cm.on('changes', () => {
      this.contentChange.emit(this.cm.getValue());
    });

    this.cm.on("inputRead", (cm) => {
      if (this.timeout) {
        clearTimeout(this.timeout)
      };

      this.timeout = setTimeout(() => {
        CodeMirror.showHint(cm, CodeMirror.hint.anyword, {
          completeSingle: false
        });
      }, 50);
    });

    this.cm.on("keyup", (cm, event) => {
      var keyCode = event.keyCode || event.which;
      if (keyCode == 8 || keyCode == 46) {
        if(this.timeout) {
          clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
          CodeMirror.showHint(cm, CodeMirror.hint.anyword, {
            completeSingle: false
          });
        }, 50);
      }
    });
  }

  ngOnChanges (change) {
    if (this.cm && change.content.currentValue) {
      this.cm.getDoc().setValue(change.content.currentValue);
      this.cm.focus();
    }
  }
}