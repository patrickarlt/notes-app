import { Component, ViewChild, ElementRef, OnInit, Renderer } from '@angular/core';
import { ROUTER_DIRECTIVES, Router }  from '@angular/router';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl } from '@angular/forms';
import { NotesService } from '../shared/notes.service.ts';
import { NoteService } from '../shared/note.service.ts';
import { Note } from '../shared/note';
import { NotesStore } from '../shared/notes-store.service';
import { Subject } from 'rxjs/Subject';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'notes-list',
  template: require('./notes-list.component.html'),
  styles: [
    require('./notes-list.component.scss')
  ],
  providers: [NotesService, NoteService, NotesStore],
  directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
  host: {
    '(document:keyup)': 'hotkey($event)'
  },
})
export class NotesListComponent {
  @ViewChild('searchInput') searchInput: ElementRef;
  private searchForm: FormGroup;
  private search: FormControl;
  private searchTerms;

  constructor (private renderer: Renderer, private router: Router, private notesStore: NotesStore) {
    this.search = new FormControl('');

    this.searchForm = new FormGroup({
        search: this.search
    });

    this.notesStore.loadNotes();
  }

  ngAfterViewInit () {
    let obs = this.search.valueChanges
      .debounceTime(150)
      .distinctUntilChanged();

    this.searchTerms = obs.subscribe(
      (value) => {
        this.notesStore.searchNotes(value);
        console.log('value', value);
      }
    )
  }

  ngOnDestroy () {
    this.searchTerms.dispose();
  }

  onSubmit (formValues: any) {
    let obs = this.notesStore.addNote({
      title: formValues.search,
      content: `# ${formValues.search}`,
      created: new Date(),
      edited: new Date(),
      tags: []
    });

    obs.subscribe(
      (note) => {
        this.navigateToNote(note);
      }
    )
  }

  focusInput () {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }

  clearSuggestions () {
    this.search.updateValue('');
    this.focusInput();
  }

  navigateToNote (note: Note) {
    this.clearSuggestions();
    this.router.navigate(['/note', note._id]);
  }

  hotkey ($event: KeyboardEvent) {
    if($event.keyCode === 27) {
      this.router.navigate(['/notes']);
      this.clearSuggestions();
      this.focusInput();
    }
  }
}