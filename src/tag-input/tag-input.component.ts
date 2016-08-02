import {Component, HostBinding, Input, Output, EventEmitter} from '@angular/core';
import { TagInputItemComponent } from '../tag-input-item/tag-input-item.component';

@Component({
  selector: 'tag-input',
  template: require('./tag-input.component.html'),
  styles: [
    require('./tag-input.component.scss')
  ],
  directives: [TagInputItemComponent]
})
export class TagInputComponent {
  @Input() placeholder: string = 'Add a tag';
  @Input() tagsList: string[];
  @Input() delimiterCode: string = '188';
  @Input() addOnBlur: boolean = true;
  @Input() addOnEnter: boolean = true;
  @Input() addOnPaste: boolean = true;
  @Input() allowedTagsPattern: RegExp = /.+/;
  @Output() tagsListChange = new EventEmitter<string[]>();
  @HostBinding('class.ng2-tag-input-focus') isFocussed;

  public inputValue: string = '';
  public delimiter: number;
  public selectedTag: number;

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
    this.tagsListChange.emit(this.tagsList);
  }

  private _removeTag(tagIndexToRemove) {
    this.tagsList.splice(tagIndexToRemove, 1);
    this._resetSelected();
    this.tagsListChange.emit(this.tagsList);
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
