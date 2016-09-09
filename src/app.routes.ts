/**
 * This entire file exists to configure the routes for the application.
 * It is pretty much verbatum from the routing documentation. All the
 * components referenced in routes must be in their parent components
 * `precompile` array or Angular will complain.
 *
 * https://angular.io/docs/ts/latest/guide/router.html#!#route-config
 */
import { Routes } from '@angular/router';
import { SelectNoteComponent } from './select-note/select-note.component';
import { NoteEditorComponent } from './note-editor/note-editor.component';

export const routes: Routes = [
  { path: '', component: SelectNoteComponent },
  { path: 'notes', component: SelectNoteComponent },
  { path: 'note/:id', component: NoteEditorComponent },
  { path: '**', component: SelectNoteComponent }
];