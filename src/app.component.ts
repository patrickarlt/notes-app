import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Database } from './shared/db';
import { NotesListComponent } from './notes-list/notes-list.component';
import { NotesDatabaseService } from './shared/notes-db.service';
import { NotesStore } from './shared/notes-store.service';
import { SearchResultsStore } from './shared/search-results-store.service';

/**
 * <notes-app> is the root component of our application.
 */
@Component({
  selector: 'notes-app',

  /**
   * We can take advantage of `require` to load the HTML templates for
   * components. Since we have the type definitions for Node loaded with
   * typings, Typescript knows what `require` does.
   */
  template: require('./app.component.html'),

  /**
   * Angular 2 also allows us to inline CSS into our templates we can use
   * `require` here to and let Webpack take care of bundling CSS.
   */
  styles: [
    require('./app.component.scss')
  ],

  /**
   * By default when you require styles for a component the styles are
   * scoped, and will only apply to that component. You can change the
   * behavior with `ViewEncapsulation`. This makes styles loaded for this
   * component gloal so they behave like regular CSS. Allowing the whole
   * application to be styled.
   */
  encapsulation: ViewEncapsulation.None,

  /**
   * Register providers that we want to supply to the dependency injection
   * system. Behave Angular 2 uses a heiarchical dependency injection
   * system these items are also available to all children of <notes-app>.
   */
  providers: [
    { provide: Database, useValue: Database },
    NotesDatabaseService,
    NotesStore,
    SearchResultsStore
  ],

  /**
   * Register directives that we want to use inside this template.
   */
  directives: [
    NotesListComponent,
    ROUTER_DIRECTIVES
  ]
})
export class AppComponent {}