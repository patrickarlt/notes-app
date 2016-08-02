import { Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { MarkdownPipe } from '../shared/markdown.pipe.ts';

@Component({
  selector: 'note-preview',
  template: require('./note-preview.component.html'),
  styles: [
    require('./note-preview.component.scss')
  ],
  pipes: [MarkdownPipe]
})
export class NotePreviewComponent implements OnChanges {
  @Input() content: string;
  @Input() scrollPercentage: number;
  @ViewChild('preview') preview :ElementRef;

  constructor () {}

  ngOnChanges (changes) {
    if(this.preview) {
      let editorElement = this.preview.nativeElement;
      let scrollTop = (editorElement.scrollHeight - editorElement.clientHeight) * this.scrollPercentage;
      this.preview.nativeElement.scrollTop = scrollTop;
    }
  }
}