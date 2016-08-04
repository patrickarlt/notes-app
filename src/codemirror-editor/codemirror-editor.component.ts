import { Component, ElementRef, ViewChild, ViewEncapsulation, AfterViewInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/addon/edit/continuelist';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/anyword-hint';

const noop = () => {};

@Component({
  selector: 'codemirror-editor',
  template: require('./codemirror-editor.component.html'),
  styles: [
    require('codemirror/lib/codemirror.css'),
    require('codemirror/addon/hint/show-hint.css'),
    require('./codemirror-editor.component.scss'),
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeMirrorEditorComponent),
      multi: true
    }
  ]
})
export class CodeMirrorEditorComponent implements ControlValueAccessor {
  private cm :any;
  private timeout;
  private _content: string = '';

  get content () {
    return this._content;
  }

  set content (value: any) {
    this._content = value || '';

    if (this.cm) {
      this.cm.getDoc().setValue(this.content);
    }
  }

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

    this.cm.getDoc().setValue(this.content);

    this.cm.on('changes', () => {
      this.onChangeCallback(this.cm.getValue());
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

  writeValue(value: any) {
    this.content = value || '';
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  registerOnChange(fn) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn) {
    this.onTouchedCallback = fn;
  }
}