import { Component } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { NotesListComponent } from './notes-list/notes-list.component';
import { Database } from './shared/db';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { NotesDatabaseService } from './shared/notes-db.service';
import { NotesStore } from './shared/notes-store.service';

@Component({
  selector: 'notes-app',
  template: require('./app.component.html'),
  styles: [
    require('./app.component.scss')
  ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: Database, useValue: Database },
    NotesDatabaseService,
    NotesStore
  ],
  directives: [
    NotesListComponent,
    ROUTER_DIRECTIVES
  ]
})
export class AppComponent {}