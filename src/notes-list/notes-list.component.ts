import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, OnDestroy, Renderer } from '@angular/core';
import { ROUTER_DIRECTIVES, Router }  from '@angular/router';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl } from '@angular/forms';

/**
 * The full install of rxjs is about 500kb which is way to large. Angular 2
 * recommends importing the individual classes and methods to keep builds
 * as small as possible.
 */
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';

/**
 * Import other modules form our application
 */
import { SearchResultsStore } from '../shared/search-results-store.service';
import { NotesStore } from '../shared/notes-store.service';
import { Note } from '../shared/note';


/**
 * The <notes-list> is the searchable list of notes.
*/
@Component({
  selector: 'notes-list',

  /**
   * We can take advantage of `require` to load the HTML templates for
   * components. Since we have the type definitions for Node loaded with
   * typings, Typescript knows what `require` does.
   */
  template: require('./notes-list.component.html'),

  /**
   * Angular 2 also allows us to inline CSS into our templates we can use
   * `require` here to and let Webpack take care of bundling CSS.
   */
  styles: [
    require('./notes-list.component.scss')
  ],

  /**
   * Register directives that we want to use inside this template.
   */
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ],

  /**
   * The host property isn't really documented as a part of the guides, but
   * you can use it to bind listeners to the component or another element.
   * In this case I'm using it to listen to the keyup event to listen for
   * hotkeys.
   */
  host: {
    '(document:keyup)': 'hotkeyHandler($event)'
  },
})
/**
 * Notice that this class "impliments" certain interfaces. This is a TypeScript
 * concept that allows you to check that a class has certain properties and
 * methods. In this case we are saying that this class "impliments" the OnInit,
 * AfterViewInit, and OnDestroy interfaces which are part of the components
 * lifecycle.
 *
 * https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html
 * https://www.typescriptlang.org/docs/handbook/interfaces.html#class-types
 *
 */
export class NotesListComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Typescript supports class variables so we can define the types of
   * various properties that we will define later. For example `searchForm` is a
   * `FormGroup`. We also decorate the `searchInput` property making it
   * reference the `#searchInput` element in the template. We also can initalize
   * values here like our `currentSearchTerm` and an empty array of `notes`.
   */
  @ViewChild('searchInput') searchInput: ElementRef;
  private searchForm: FormGroup;
  private search: FormControl;
  private searchTerms;
  private currentSearchTerm :string = '';
  private notes: Observable<Note[]> = Observable.of([]);
  private loaded: boolean = false;

  /**
   * Angular 2's dependency injector uses the type annotations in the
   * constructor to lookup and inject the dependencies needed to create the
   * component. For example have a dependency on an instace of `NotesStore`,
   * so Angular get fetch an existing instance of NotesStore (or create it)
   * and assign it to the `notesStore` variable so we can access it in our
   * class.
   *
   * It is worth noting that every component has its own injector so if we want every component to have its own instance of a dependency we can put the dependency in the `providers` array of the component.
   *
   * https://angular.io/docs/ts/latest/guide/dependency-injection.html
   * https://angular.io/docs/ts/latest/guide/hierarchical-dependency-injection.html
   */
  constructor (
    private renderer: Renderer,
    private router: Router,
    private notesStore: NotesStore,
    private searchResultsStore: SearchResultsStore) {

    /**
     * This is how "model driven" forms are created. `search` and
     * `searchForm` are references to the corresponding `formGroup` and
     * `formControl` elements in the template.
     */
    this.search = new FormControl('');
    this.searchForm = new FormGroup({
        search: this.search
    });
  }

  /**
   * This is out implimentation of the `OnInit` interface. Typescript will
   * complain if we remove this method. This is where we tell the noteStore
   * (provided by the dependency injection system in the constructor) to load
   * the notes. We use the callback from loading the notes to set a flag used to
   * toggle loading indicators.
   */
  ngOnInit () {
    this.notesStore.loadNotes().then((response) => {
      this.loaded = true;
    });
  }

  /**
   * This is our implimentation of the `AfterViewInit` interface. We want to
   * hook into this because this is where the inputs will be ready.
   */
  ngAfterViewInit () {
    /**
     * FormControl has an Observable `valueChanges` which we can subscribe to
     * and get the latest value from it. We use the `debounceTime` operator to
     * limit rate at which we get values and the `distinctUntilChanged` operator
     * to filter out values where the value is the same as the last event, so we
     * don't search for notes twice. When we get a new value we can pass it to
     * the search store to start searching for notes.
     *
     * https://css-tricks.com/the-difference-between-throttling-and-debouncing/
     * https://angular.io/docs/ts/latest/guide/server-communication.html#!#more-observables
     */
    this.searchTerms = this.search.valueChanges
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe((term) => {
        this.currentSearchTerm = term || '';
        this.searchResultsStore.search(term);
      });

    /**
     * Now we have 2 Observables, this.notesStore.notes representing our notes
     * this.searchResultsStore.results which respresents the IDs of notes
     * matching our search we want to combine these into a new Observable that
     * represents the list of notes we should be showing in the list.
     * `Observable.combineLatest` take any number of Observables and a combiner
     * function and returns a new Observable that emits the results of the
     * combiner function. Whenever any of the source Observables update, the
     * combiner runs and a new value gets emitted for the combined Observable.
     * We don't subscribe to this Observable, instead we use the `async` in our
     * template which handles the subscribe and unsubscribe for us.
     *
     * http://reactivex.io/documentation/operators/combinelatest.html
     * https://auth0.com/blog/angular2-series-working-with-pipes/
     * https://angular.io/docs/ts/latest/guide/pipes.html
     */
    this.notes = Observable.combineLatest(
      this.notesStore.notes,
      this.searchResultsStore.results,
      /**
       * This is the combiner function. We get the latest value of
       * `this.notesStore.notes` and `this.searchResultsStore.results` we can
       * calculate what the new list of notes should be in response to these 2
       * values.
       */
      (notes, results) => {
        /**
         * If we don't currently have a search term show all notes.
         */
        if(this.currentSearchTerm.length === 0) {
          return notes;
        }

        /**
         * If we have a search term we should filter notes, showing only notes
         * whose ID exists in the `results` array.
         */
        return notes.filter((note) => {
          return results.indexOf(note._id) >= 0;
        });
      }
    )
  }

  /**
   * Implimentation of the OnDestroy interface. All we do here is unsubscribe
   * from the searchTerms Observable, cleaning up after ourselves. Just like
   * removing event handlers.
   */
  ngOnDestroy () {
    this.searchTerms.unsubscribe();
  }


  /**
   * Handles the submission of our search form. This creates a new note and
   * redirects the user to it once it is created.
   */
  onSubmit (formValues :any) {
    this.notesStore.addNote({
      title: formValues.search,
      content: `# ${formValues.search}`,
      created: new Date(),
      edited: new Date(),
      tags: []
    }).then((note) => {
      this.navigateToNote(note);
    });
  }

  /**
   * A simple method to focus the search input. This uses the yet to be
   * documented Renderer API's as opposed to calling
   * `this.searchInput.nativeElement.focus()` manually.
   *
   * http://stackoverflow.com/questions/34522306/angular-2-focus-on-newly-added-input-element
   */
  focusInput () {
    this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
  }

  /**
   * Method to clear the search input. Note that this just sets the value on edited
   * FormControl rather then via the DOM.
   */
  clearSearch () {
    this.search.updateValue('');
  }

  /**
   * Method to navigate to a specific note. We could do this with a link but we
   * also want to clear the search first.
   */
  navigateToNote (note: Note) {
    this.clearSearch();
    this.router.navigate(['note', note._id]);
  }

  /**
   * Event handler for listening to hotkeys. We want to listen to "ESC" and
   * navigate back to notes and refocus the input when it is pressed.
   */
  hotkeyHandler ($event: KeyboardEvent) {
    if($event.keyCode === 27) {
      this.router.navigate(['notes']);
      this.clearSearch();
      this.focusInput();
    }
  }
}