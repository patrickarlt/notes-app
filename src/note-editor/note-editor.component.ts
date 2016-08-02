import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../shared/note';
import { ViewEncapsulation } from '@angular/core';
import { CodeMirrorEditorComponent } from '../codemirror-editor/codemirror-editor.component';
import { TagInputComponent } from '../tag-input/tag-input.component';
import { NotesStore } from '../shared/notes-store.service'
import { Router } from '@angular/router';

@Component({
  selector: 'note-editor',
  template: require('./note-editor.component.html'),
  styles: [
    require('./note-editor.component.scss'),
  ],
  directives: [
    CodeMirrorEditorComponent,
    TagInputComponent
  ],
  providers: [NotesStore]
})
export class NoteEditorComponent {
  @Input() note: Note;
  @Output() contentChange = new EventEmitter<string>();
  @Output() tagChange = new EventEmitter<string[]>();
  @Output() scrollPercentageChange = new EventEmitter<number>();

  constructor (
    private router: Router,
    private notesStore: NotesStore) {}

  onContentChange (content: string) {
    this.contentChange.emit(content);
  }

  onScroll (e) {
    var a = e.target.scrollTop;
    var b = e.target.scrollHeight - e.target.clientHeight;
    var c = a / b;
    this.scrollPercentageChange.emit(this.round(c, 2));
  }

  onTagChange (tags: string[]) {
    this.note.tags = tags;
    this.tagChange.emit(tags);
  }

  onDelete () {
    let obs = this.notesStore.deleteNote(this.note);

    obs.subscribe(
      (deleted) => {
        this.router.navigate(['/notes']);
      }
    )
  }

  round (number: number, precision: number) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  }
}