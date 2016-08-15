import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * The `<tag-input-item>` represents a tag managed by our `<tag-input>`
 * component. Seperating this out into seperate logic makes our `<tag-input>`
 * smaller and responsible for a smaller part of our application.
 */
@Component({
  selector: 'tag-input-item',
  template: require('./tag-input-item.component.html'),
  styles: [
    require('./tag-input-item.component.scss')
  ]
})
export class TagInputItemComponent {
  @Input() text: string;
  @Input() index: number;
  @Output() tagRemoved = new EventEmitter<number>();

  constructor() { }

  removeTag() {
    this.tagRemoved.emit(this.index);
  }
}
