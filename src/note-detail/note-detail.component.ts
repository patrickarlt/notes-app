import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteEditorComponent } from '../note-editor/note-editor.component';
import { NotePreviewComponent } from '../note-preview/note-preview.component';
import { NoteService } from '../shared/note.service.ts';
import { Router } from '@angular/router';
import { Note } from '../shared/note';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'note-detail',
  template: require('./note-detail.component.html'),
  styles: [
    require('./note-detail.component.scss'),
  ],
  directives: [
    NoteEditorComponent,
    NotePreviewComponent
  ],
  providers: [NoteService]
})
export class NoteDetailComponent implements OnInit, OnDestroy {
  constructor (
    private route: ActivatedRoute,
    private noteService: NoteService,
    private router: Router) {}

  private sub: any;
  private id: string;
  private contentEditStream = new Subject()
  private tagEditStream = new Subject()

  public previewContent: string;
  public scrollPercentage: number;
  public note :Note = {
    _id: '',
    _rev: '',
    title: '',
    content: '',
    tags: [],
    created: new Date(),
    edited: new Date()
  };

  ngOnInit() {
    this.sub = this.route.params.subscribe((params :any) => {
      this.id = params.id;
      this.noteService.getNote(this.id).then(note => {
        this.note = note;
        this.previewContent = note.content;
        this.scrollPercentage = 0;
      });
    });

    this.contentEditStream
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((content: string) => {
        this.noteService.updateNoteContent(this.id, content);
      });

    this.tagEditStream
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((tags: string[]) => {
        this.noteService.updateNoteTags(this.id, tags);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onContentChange (content: string) {
    this.previewContent = content;
    this.contentEditStream.next(content);
  }

  onTagChange (tags: string[]) {
    this.tagEditStream.next(tags);
  }

  onScrollPercentageChange (scrollPercentage: number) {
    this.scrollPercentage = scrollPercentage;
  }
}