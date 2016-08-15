import { Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../shared/note';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { CodeMirrorEditorComponent } from '../codemirror-editor/codemirror-editor.component';
import { TagInputComponent } from '../tag-input/tag-input.component';
import { NotesDatabaseService } from '../shared/notes-db.service'
import { NotesStore } from '../shared/notes-store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotePreviewComponent } from '../note-preview/note-preview.component';
import { RoundPipe } from '../shared/round.pipe';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { ScrollTopDirective } from '../shared/scrollTop.directive';

@Component({
  selector: 'note-editor',
  template: require('./note-editor.component.html'),
  styles: [
    require('./note-editor.component.scss'),
  ],
  directives: [
    CodeMirrorEditorComponent,
    TagInputComponent,
    NotePreviewComponent,
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
    ScrollTopDirective
  ],
  pipes: [RoundPipe]
})
export class NoteEditorComponent {
  private note: Note = {
    content: '',
    tags: [],
    edited: new Date(),
    created: new Date(),
    title: ''
  };
  private loading: boolean;
  private scrollPercentage: number = 0;
  private editorSubscription: any;
  private paramsSubscription: any;
  private routerSubsciption: any;

  @ViewChild('noteForm') noteForm;

  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private notesDatabase: NotesDatabaseService,
    private notesStore: NotesStore) {}

  ngOnInit() {
    this.routerSubsciption = this.route.params.subscribe((params: any) => {
      this.notesStore.loadNote(params.id)
        .then(() => {
          this.scrollPercentage = 0;
        })
        .catch((error) => {
          if(error.status === 404) {
            this.router.navigate(['notes']);
          }
        });
    });

    this.paramsSubscription = Observable.combineLatest(
      this.route.params,
      this.notesStore.notes,
      (params :any, notes) => {
        return notes.find((note) => {
          return note._id === params.id;
        });
      })
      .subscribe((note) => {
        if (!note) {
          this.loading = true;
          return;
        }

        this.note = note;
        this.loading = false;
      });
  }

  ngAfterViewInit() {
    this.editorSubscription = this.noteForm.control.valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((values) => {
        this.note.edited = new Date();
        this.notesStore.updateNote(this.note);
      });
  }

  ngOnDestroy () {
    this.paramsSubscription.unsubscribe();
    this.editorSubscription.unsubscribe();
    this.routerSubsciption.unsubscribe();
  }

  onScroll (e) {
    let el = e.target;
    this.scrollPercentage = el.scrollTop / (el.scrollHeight - el.clientHeight);
  }

  onDelete () {
    this.notesStore.deleteNote(this.note).then((deleted) => {
      this.router.navigate(['/notes']);
    });
  }
}