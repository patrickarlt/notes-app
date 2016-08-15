import {Component, HostBinding, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import { TagInputItemComponent } from '../tag-input-item/tag-input-item.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * This component is a stripped down version of
 * https://www.npmjs.com/package/angular2-tag-input which I updated for the
 * Angular 2.0 release canidate.
 */

/**
 * We need an empty function for later use in `ControlValueAccessor`.
 */
const noop = () => {};

/**
 * `<tag-input>` is a custom input used to manage tags on notes. It implements
 * `ControlValueAccessor` so it can be used with `ngModel` in `<note-editor>`.
 * The process of hooking this up is fairly simple but requires a deep
 * conceptual understanding of how a lot of stuff works in Angular 2.0. There
 * were several articles that were particularly helpful for me in figuring this
 * out. Once you do this it becomes trivial to use `ngModel` or to have a
 * component represent a form control.
 *
 * http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
 * http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel
 */
@Component({
  selector: 'tag-input',
  template: require('./tag-input.component.html'),
  styles: [
    require('./tag-input.component.scss')
  ],
  directives: [TagInputItemComponent],
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
      useExisting: forwardRef(() => TagInputComponent),
      multi: true
    }
  ]
})
export class TagInputComponent implements ControlValueAccessor {
  /**
   * General configuration including placeholder string, delimiter and allowed
   * tag regex.
   */
  @Input() placeholder: string = 'Add a tag';
  @Input() delimiterCode: string = '188';
  @Input() allowedTagsPattern: RegExp = /.+/;

  /**
   * `HostBinding` binds a property on the component to a element property. In
   * this case we want `isFocussed` to toggle a class on the parent.
   */
  @HostBinding('class.ng2-tag-input-focus') isFocussed;

  /**
   * This property gets bound to the actual <input> where users enter tags.
   */
  public inputValue: string = '';
  public delimiter: number;

  /**
   * we are using a getter/setter pair as recommended by an article on
   * implimenting `ControlValueAccessor`. This reduces the overhead needed to
   * broadcast changes in the value.
   *
   * http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
   */
  private _tagsList: string[] = [];

  get tagsList () {
    return this._tagsList;
  }

  set tagsList (value) {
    this._tagsList = value;
    /**
     * onChangeCallback is part of the `ControlValueAccessor` implimentation.
     * This will tell other parts of Angular that the value of this component
     * has changed. We setup `onChangeCallback` a bit later.
     */
    this.onChangeCallback(this.tagsList);
  }

  constructor() {}

  /**
   * Since properties like delimiterCode are set as strings we need to parse it
   * into a character code that we can use.
   */
  ngOnInit() {
    this.delimiter = parseInt(this.delimiterCode);
  }

  /**
   * Handles when our input changes. We need special cases for handling our
   * delimiter, enter and backspace.
   */
  inputChanged(event) {
    let key = event.keyCode;
    switch(key) {
      case 8: // Backspace
        this.handleBackspace();
        break;
      case 13: //Enter
        this.addTags([this.inputValue]);
        event.preventDefault();
        break;

      case this.delimiter:
        this.addTags([this.inputValue]);
        event.preventDefault();
        break;
    }
  }

  /**
   * Handles when focus leaves the input. This adds existing tags, clears the
   * input and calls `onTouchedCallback` which is part of `ControlValueAccessor`
   * that tells Angular that we have visited this input for form validation.
   */
  inputBlurred(event) {
    this.addTags([this.inputValue]);
    this.isFocussed = false;
    this.onTouchedCallback();
  }

  /**
   * Opposite of `inputBlurred` this will set a class on the component we can
   * use for styling.
   */
  inputFocused(event) {
    this.isFocussed = true;
  }

  /**
   * Handles when users paste content into the form field.
   */
  inputPaste(event) {
    let clipboardData = event.clipboardData || (event.originalEvent && event.originalEvent.clipboardData);
    let pastedString = clipboardData.getData('text/plain');
    let tags = this.splitString(pastedString);
    let tagsToAdd = tags.filter((tag) => this.isTagValid(tag));
    this.addTags(tagsToAdd);
  }

  /**
   * Part of the implimentation of `ControlValueAccessor`. `writeValue`
   * is called whenever the value is updated from an ourside source. It might be
   * `undefined` so we check manually for that case.
   */
  writeValue(value: any) {
    if(value !== undefined) {
      this.tagsList = value;
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

  /**
   * Utility method used to split a pasted string into tags.
   */
  private splitString(tagString: string) {
    tagString = tagString.trim();
    let tags = tagString.split(String.fromCharCode(this.delimiter));
    return tags.filter((tag) => !!tag);
  }

  /**
   * Utility method to determine if a tag is valid.
   */
  private isTagValid(tagString: string) {
    return this.allowedTagsPattern.test(tagString);
  }

  /**
   * Utility method for adding one or more tags.
   */
  private addTags(tags: string[]) {
    let validTags = tags.filter((tag) => this.isTagValid(tag));
    this.tagsList = this.tagsList.concat(validTags);
    this.inputValue = '';
  }

  /**
   * Utility method for removing a tag. This is bound to the `tagRemoved` output
   * on <tag-input-item>.
   */
  private removeTag(tagIndexToRemove) {
    this.tagsList.splice(tagIndexToRemove, 1);
  }

  /**
   * Event handler for when backspace is pressed. Will delete the last added tag
   * if the input is empty.
   */
  private handleBackspace() {
    if (!this.inputValue.length && this.tagsList.length) {
      this.removeTag(this.tagsList.length - 1);
    }
  }
}
