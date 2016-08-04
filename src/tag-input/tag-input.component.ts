import {Component, HostBinding, Input, Output, EventEmitter, forwardRef} from '@angular/core';
import { TagInputItemComponent } from '../tag-input-item/tag-input-item.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = () => {};

@Component({
  selector: 'tag-input',
  template: require('./tag-input.component.html'),
  styles: [
    require('./tag-input.component.scss')
  ],
  directives: [TagInputItemComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true
    }
  ]
})
export class TagInputComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Add a tag';
  @Input() delimiterCode: string = '188';
  @Input() addOnBlur: boolean = true;
  @Input() addOnEnter: boolean = true;
  @Input() addOnPaste: boolean = true;
  @Input() allowedTagsPattern: RegExp = /.+/;
  @HostBinding('class.ng2-tag-input-focus') isFocussed;

  public inputValue: string = '';
  public delimiter: number;
  public selectedTag: number;
  private _tagsList: string[] = [];

  get tagsList () {
    return this._tagsList;
  }

  set tagsList (value) {
    this._tagsList = value;
    this.onChangeCallback(this.tagsList);
  }

  constructor() {
  }

  ngOnInit() {
    this.delimiter = parseInt(this.delimiterCode);
  }

  inputChanged(event) {
    let key = event.keyCode;
    switch(key) {
      case 8: // Backspace
        this._handleBackspace();
        break;
      case 13: //Enter
        this.addOnEnter && this._addTags([this.inputValue]);
        event.preventDefault();
        break;

      case this.delimiter:
        this._addTags([this.inputValue]);
        event.preventDefault();
        break;

      default:
        this._resetSelected();
        break;
    }
  }

  inputBlurred(event) {
    this.addOnBlur && this._addTags([this.inputValue]);
    this.isFocussed = false;
    this.onTouchedCallback();
  }

  inputFocused(event) {
    this.isFocussed = true;
  }

  inputPaste(event) {
    let clipboardData = event.clipboardData || (event.originalEvent && event.originalEvent.clipboardData);
    let pastedString = clipboardData.getData('text/plain');
    let tags = this._splitString(pastedString);
    let tagsToAdd = tags.filter((tag) => this._isTagValid(tag));
    this._addTags(tagsToAdd);
    setTimeout(() => this.inputValue = '', 3000);
  }

  writeValue(value: any) {
    if(value !== undefined) {
      this.tagsList = value;
    }
  }

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  registerOnChange(fn) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn) {
    this.onTouchedCallback = fn;
  }

  private _splitString(tagString: string) {
    tagString = tagString.trim();
    let tags = tagString.split(String.fromCharCode(this.delimiter));
    return tags.filter((tag) => !!tag);
  }

  private _isTagValid(tagString: string) {
    return this.allowedTagsPattern.test(tagString);
  }

  private _addTags(tags: string[]) {
    let validTags = tags.filter((tag) => this._isTagValid(tag));
    this.tagsList = this.tagsList.concat(validTags);
    this._resetSelected();
    this._resetInput();
  }

  private _removeTag(tagIndexToRemove) {
    this.tagsList.splice(tagIndexToRemove, 1);
    this._resetSelected();
  }

  private _handleBackspace() {
    if (!this.inputValue.length && this.tagsList.length) {
      this._removeTag(this.tagsList.length - 1);
    }
  }

  private _resetSelected() {
    this.selectedTag = null;
  }

  private _resetInput() {
    this.inputValue = '';
  }
}
