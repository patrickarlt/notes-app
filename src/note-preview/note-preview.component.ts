import { Component, Input } from '@angular/core';
import { MarkdownPipe } from '../shared/markdown.pipe';
import { ScrollTopDirective } from '../shared/scrollTop.directive';
/**
 * The <note-preview> component handles displaying a rendered view of
 * Markdown content and syncing the scrollbars with its editor.
 */
@Component({
  selector: 'note-preview',
  template: require('./note-preview.component.html'),
  styles: [
    require('./note-preview.component.scss')
  ],
  /**
   * Just like providers and directives we need to tell this component about
   * pipes that are using.
   */
  pipes: [ MarkdownPipe ],

  /**
   * We also provide a custom attribute directive to control the scroll
   * position of our preview.
   */
  directives: [ ScrollTopDirective ]
})
export class NotePreviewComponent {
  /**
   * The `@Input` decorator can be used to tell Angular 2 that this property
   * will come from an attribute binding on this component. For example
   * <note-preview [content]="..." [scrollPercentage]="...">.
   */
  @Input() content: string;
  @Input() scrollPercentage: number;

  constructor () {}
}