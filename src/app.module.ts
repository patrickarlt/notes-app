/**
 * Import core dependencies from Angular 2
 */
import { NgModule }  from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Import our apps components.
 */
import { AppComponent } from './app.component';
import { NotesListComponent } from './notes-list/notes-list.component';
import { SelectNoteComponent } from './select-note/select-note.component';
import { NoteEditorComponent } from './note-editor/note-editor.component';
import { CodeMirrorEditorComponent } from './codemirror-editor/codemirror-editor.component';
import { NotePreviewComponent } from './note-preview/note-preview.component';
import { TagInputComponent } from './tag-input/tag-input.component';
import { TagInputItemComponent } from './tag-input-item/tag-input-item.component';

/**
 * Import our apps pipes.
 */
import { RoundPipe } from './shared/round.pipe';
import { MarkdownPipe } from './shared/markdown.pipe';

/**
 * Import our apps directives.
 */
import { ScrollTopDirective } from './shared/scrollTop.directive';

/**
 * Import our apps routes.
 */
import { routes } from './app.routes';

/**
 * Define our app as an NgModule that has all of our components, directives and
 * pipes as declarations. We also can import other modules that we need like
 * the RouterModule and FormsModule. Finally we can bootstrap our AppComponent.
 *
 * https://angular.io/docs/ts/latest/cookbook/rc4-to-rc5.html
 * https://angular.io/docs/ts/latest/guide/ngmodule.html
 */
@NgModule({
  declarations: [
    AppComponent,
    NotesListComponent,
    NoteEditorComponent,
    SelectNoteComponent,
    RoundPipe,
    ScrollTopDirective,
    MarkdownPipe,
    CodeMirrorEditorComponent,
    NotePreviewComponent,
    TagInputItemComponent,
    TagInputComponent
  ],
  imports:      [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}