import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tag-input-item',
  template: require('./tag-input-item.component.html'),
  styles: [
    require('./tag-input-item.component.scss')
  ],
  host: {
    '[class.ng2-tag-input-item-selected]': 'selected'
  }
})
export class TagInputItemComponent {
  @Input() selected: boolean;
  @Input() text: string;
  @Input() index: number;
  @Output() tagRemoved = new EventEmitter<number>();

  constructor() { }

  removeTag() {
    this.tagRemoved.emit(this.index);
  }
}
