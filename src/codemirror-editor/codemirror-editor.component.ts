import { Component, ElementRef, ViewChild, ViewEncapsulation, AfterViewInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/addon/edit/continuelist';

const noop = () => {};

/**
 * <codemirror-editor> is a wrapper around CodeMirror that integrates it with
 * Angular 2 as a custom form control. It implements `ControlValueAccessor` so
 * it can be used with `ngModel` in `<note-editor>`. The process of hooking this
 * up is fairly simple but requires a deep conceptual understanding of how a lot
 * of stuff works in Angular 2.0. There were several articles that were
 * particularly helpful for me in figuring this out. Once you do this it becomes
 * trivial to use `ngModel` or to have a component represent a form control.
 *
 * http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
 * http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel
 */
@Component({
  selector: 'codemirror-editor',
  template: require('./codemirror-editor.component.html'),
  styles: [
    require('codemirror/lib/codemirror.css'),
    require('./codemirror-editor.component.scss'),
  ],
  /**
   * Since we are including the CodeMirror css as well as our custom styles we
   * need to tell Angular that it should not encapsulate this CSS.
   */
  encapsulation: ViewEncapsulation.None,
  providers: [
    /**
     * This is a little magic supplied by several articles. Exactly what it does
     * I am not entirely sure of. The dependency injection article does go into
     * more detail about using `forwardRef` though.
     *
     * http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html
     * http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
     * http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel
     */
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeMirrorEditorComponent),
      multi: true
    }
  ]
})
export class CodeMirrorEditorComponent implements ControlValueAccessor, AfterViewInit {
  private cm :any;

  /**
   * Like the list of tags in <tag-input> we use a getter/setter pair to make it
   * easier to inform update the value of the internal CodeMirror editor.
   */
  private _content: string = '';

  get content () {
    return this._content;
  }

  set content (value: any) {
    this._content = value || '';

    /**
     * Note that we make sure we have CodeMirror setup before we try to set the
     * value since this might be called before the view initalizes and we setup
     * CodeMirror.
     */
    if (this.cm) {
      this.cm.getDoc().setValue(this.content);
    }
  }

  /**
   * We will need a reference to an actual DOM element to hook up to CodeMirror
   * so we can get a reference to the element with `#editor` here.
   */
  @ViewChild('editor') editor :ElementRef;

  constructor () {}

  /**
   * Now we can implement AfterViewInit which is fired after Angular sets up the
   * view for the first time.
   */
  ngAfterViewInit () {
    /**
     * This initalizes CodeMirror with our editor element and a few small extras
     * like a GitHub Flavored Markdown, list completion, and infinite scroll.
     */
    this.cm = CodeMirror.fromTextArea(this.editor.nativeElement, {
      viewportMargin: Infinity,
      lineWrapping: true,
      mode: 'gfm',
      extraKeys: {
        "Enter": "newlineAndIndentContinueMarkdownList"
      }
    });

    /**
     * Now that we have a CodeMirror instance we can set its value to show the
     * proper content.
     */
    this.cm.getDoc().setValue(this.content);

    /**
     * Whenever CodeMirror gives us a changes event we can pass that to the
     * `ControlValueAccessor` callback to inform Angular that the value of this
     * input has changed.
     */
    this.cm.on('changes', () => {
      this.onChangeCallback(this.cm.getValue());
    });
  }

  /**
   * Part of the implimentation of `ControlValueAccessor`. `writeValue`
   * is called whenever the value is updated from an ourside source. It might be
   * `undefined` so we check manually for that case.
   */
  writeValue(value: any) {
    if(value !== undefined) {
      this.content = value;
    }
  }

  /**
   * Part of the implimentation of `ControlValueAccessor`. `registerOnChange`
   * gets passed a function that we need to call whenever we change the value
   * of our input.
   */
  private onChangeCallback: (_: any) => void = noop;

  registerOnChange(fn) {
    this.onChangeCallback = fn;
  }

  /**
   * Part of the implimentation of `ControlValueAccessor`. `registerOnTouched`
   * gets passed a function that we need to call whenever the user "touches" or
   * focuses and unfocuses this input.
   */
  private onTouchedCallback: () => void = noop;

  registerOnTouched(fn) {
    this.onTouchedCallback = fn;
  }
}