import { provideRouter, RouterConfig } from '@angular/router';
import { SelectNoteComponent } from './select-note/select-note.component';
import { NoteEditorComponent } from './note-editor/note-editor.component';

const routes: RouterConfig = [
  { path: '', component: SelectNoteComponent },
  { path: 'notes', component: SelectNoteComponent },
  { path: 'note/:id', component: NoteEditorComponent },
  { path: '**', component: SelectNoteComponent }
];

export const appRouterProviders = [
  provideRouter(routes)
];