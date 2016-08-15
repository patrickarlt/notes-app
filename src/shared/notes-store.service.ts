import { Injectable } from '@angular/core';
import { NotesDatabaseService } from './notes-db.service';
import { Note } from './note';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/find';

@Injectable()
export class NotesStore {
  constructor (
    private notesDatabase: NotesDatabaseService
  ) {}

  /**
   * Create a private BehaviorSubject to store the results. Each event emitted
   * by BehaviorSubject will be an array of strings. BehaviorSubjects are both
   * Observables and Observers so they can both emit events and subscribe to
   * them. You can also get the current value of a BehaviorSubject at any point.
   * This is the core of the Observable data services pattern.
   *
   * http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
   * https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md
   */
  private _notes = new BehaviorSubject<Note[]>([])

  /**
   * We don't want to expose the results BehaviorSubject to the rest of our
   * application. We only want our application to subscribe to changes and call
   * the methods on the store. So we can expose the results as an Observable so
   * consumers of the store cannot call `next` on the BehaviorSubject and emit
   * a new value.
   *
   * http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
   */
  get notes () :Observable<Note[]> {
    return this._notes.asObservable();
  }

  /**
   * This method loads a single note and pushes it into the notes array. This is
   * used in the <note-editor> element to ensure that a single note is loaded.
   */
  loadNote (id: string) :Promise<Note> {
    return this.notesDatabase.getNote(id)
      .then((note: Note) => {
        let notes = this._notes.getValue(); // Get a list of current notes
        let index = notes.findIndex(note => note._id === id);

        /**
         * If we didn't find the note we can add it to the array of notes.
         * Otherwise we can replace the previous version of this note with the
         * new version.
         */
        if(index === -1) {
          notes.push(note);
        } else {
          notes[index] = note;
        }

        this._notes.next(notes); // emit a new value that includes our new note.

        return note;
      });
  }

  /**
   * A method gets all the notes from the database and emits a new value
   * that represents the new value of all notes.
   */
  loadNotes () :Promise<Note[]> {
    return this.notesDatabase.getAllNotes()
      .then((notes:Note[]) => {
        this._notes.next(notes);
        return notes;
      });
  }

  /**
   * This method will add a new note to the database and to the store and emit
   * the new value of all notes.
   */
  addNote (note: Note) :Promise<Note> {
    return this.notesDatabase.addNote(note)
      .then((note: Note) => {
        this._notes.next(this._notes.getValue().concat([note]));
        return note;
      });
  }

  /**
   * This method will remove a note from the database and from the store
   * and emit the new value of all notes.
   */
  deleteNote (deleted: Note) :Promise<any> {
    return this.notesDatabase.deleteNote(deleted)
    .then((response) => {
      let notes = this._notes.getValue();
      let index = notes.findIndex((note) => note._id === deleted._id);
      let deletedNotes = notes.splice(index, 1)
      this._notes.next(notes);
      return response;
    });
  }

  /**
   * This will update a note in the database and in the store and emit the new
   * value of all notes.
   */
  updateNote (note: Note) :Promise<Note> {
    return this.notesDatabase.updateNote(note)
      .then((note: Note) => {
        let notes = this._notes.getValue();
        let index = notes.findIndex((n) => n._id === note._id);
        notes[index] = note;
        this._notes.next(notes);
        return note;
      });
  }
}