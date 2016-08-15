import { Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../shared/note';
import { FORM_DIRECTIVES, FormGroup, FormControl } from '@angular/forms';
import { ViewEncapsulation } from '@angular/core';
import { CodeMirrorEditorComponent } from '../codemirror-editor/codemirror-editor.component';
import { TagInputComponent } from '../tag-input/tag-input.component';
import { NotesStore } from '../shared/notes-store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotePreviewComponent } from '../note-preview/note-preview.component';
import { RoundPipe } from '../shared/round.pipe';
import { ScrollTopDirective } from '../shared/scrollTop.directive';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

/**
 * <note-editor> is the most complicated component in our application. It makes
 * heavy use of Observables. <note-editor> also combines many built-in and
 * custom directives which adds to its compledity.
 */
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
    ScrollTopDirective
  ],
  pipes: [ RoundPipe ]
})
export class NoteEditorComponent {
  /**
   * since we want to bind our child <codemirror-editor> and <tag-input>
   * components to `note.content` and `note.tags` respectivly we need an empty
   * note for them to bind against until we set it up properly.
   */
  private note: Note = {
    content: '',
    tags: [],
    edited: new Date(),
    created: new Date(),
    title: ''
  };

  /**
   * Set a number of private variables we need for later.
   */
  private loading: boolean;
  private scrollPercentage: number = 0;
  private editorSubscription: any;
  private paramsSubscription: any;
  private routerSubsciption: any;

  /**
   * Since we want to subscribe to changes in our form to do auto saving we need
   * a reference to the `#noteForm` that we setup in our template.
   */
  @ViewChild('noteForm') noteForm;

  /**
   * We need a few things from the dependency injector here like the router, the
   * active route and our note store.
   */
  constructor (
    private router: Router,
    private route: ActivatedRoute,
    private notesStore: NotesStore) {}

  ngOnInit() {
    /**
     * Now that we have instances of what we need from the dependency injector
     * we can subscribe to changes in the active route and get the ID of the
     * currently selected note.
     *
     * https://angular.io/docs/ts/latest/guide/router.html#!#route-parameters
     */
    this.routerSubsciption = this.route.params.subscribe((params: any) => {
      /**
       * When the route changes lets make sure the note is loaded into the
       * noteStore. If we find a note we can reset the scrollPercentage we can
       * be sure we are at the top of our new note. If we cant find the note
       * redirect back to the note list.
       */
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

    /**
     * Now we want to setup our editor to always show the latest note whenever
     * the note OR the route param changes. Using `Observable.combineLatest` we
     * can create a new Observable that represents a new value for `note` based
     * on the latest information.
     *
     * http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-combineLatest
     */
    this.paramsSubscription = Observable.combineLatest(
      /**
       * Pass in any number of Observables...
       */
      this.route.params,
      this.notesStore.notes,

      /**
       * and a function that combines them to return a new value...
       */
      (params :any, notes) => {
        return notes.find((note) => {
          return note._id === params.id;
        });
      })

      /**
       * then subscribe to the results of our new Observable.
       */
      .subscribe((note) => {
        /**
         * If we don't have a note we know we are loading one since we load the
         * note as part of our `paramsSubscription`.
         */
        if (!note) {
          this.loading = true;
          return;
        }

        /**
         * We have an updated value for note so lets set it and set loading to
         * false to show the editor.
         */
        this.note = note;
        this.loading = false;
      });
  }

  /**
   * We still want auto-saving so we can subscribe to 'valueChanges' on our
   * `#noteForm` and add a small debounce and filtering function to reduce noise
   * and notw auto-save to often.
   *
   * https://angular.io/docs/ts/latest/guide/server-communication.html#!#more-observables
   */
  ngAfterViewInit() {
    this.editorSubscription = this.noteForm.control.valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe((values) => {
        this.note.edited = new Date();
        this.notesStore.updateNote(this.note);
      });
  }

  /**
   * Like event handlers we should always unsubscribe from any subscritions we
   * create to avoid memory leaks.
   */
  ngOnDestroy () {
    this.paramsSubscription.unsubscribe();
    this.editorSubscription.unsubscribe();
    this.routerSubsciption.unsubscribe();
  }

  /**
   * Simple function that calculates the percentace we have scrolled in our
   * editor div. We use this with the [scrollTop] directive to sync scrollbar
   * position.
   */
  onScroll (e) {
    let el = e.target;
    this.scrollPercentage = el.scrollTop / (el.scrollHeight - el.clientHeight);
  }

  /**
   * This is a simple function to delete a note from our store and redirect to
   * the main notes list.
   */
  onDelete () {
    this.notesStore.deleteNote(this.note).then((deleted) => {
      this.router.navigate(['/notes']);
    });
  }
}