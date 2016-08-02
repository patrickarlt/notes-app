import { provideRouter, RouterConfig } from '@angular/router';
import { SelectNoteComponent } from './select-note/select-note.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';

const routes: RouterConfig = [
  { path: '', component: SelectNoteComponent },
  { path: 'notes', component: SelectNoteComponent },
  { path: 'note/:id', component: NoteDetailComponent },
  { path: '**', component: SelectNoteComponent }
];

export const appRouterProviders = [
  provideRouter(routes)
];