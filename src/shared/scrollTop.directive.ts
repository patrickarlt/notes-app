import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

/**
 * scrollTop is an attribute directive that controls the scrollTop property
 * based on a value. It is used in <note-preview> and <note-editor> to control
 * the position of the scrollbar.
 *
 * https://angular.io/docs/ts/latest/guide/attribute-directives.html
 */
@Directive({ selector: '[scrollTop]' })
export class ScrollTopDirective implements OnChanges {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  @Input('scrollTop') scrollTop: string;

  ngOnChanges (changes) {
    let editorElement = this.el;
    let scrollTop = (this.el.scrollHeight - this.el.clientHeight) * changes.scrollTop.currentValue;
    this.el.scrollTop = scrollTop;
  }
}