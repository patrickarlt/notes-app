import { Injectable } from '@angular/core';
import { NotesDatabaseService } from './notes-db.service';
import { Note } from './note';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class NotesStore {
  constructor (
    private notesDatabase: NotesDatabaseService
  ) {}

  public _notes = new BehaviorSubject<Note[]>([]);

  get notes () :Observable<Note[]> {
    return this._notes.asObservable();
  }

  loadNotes () :Observable<Note[]> {
    let obs = this.notesDatabase.getAllNotes();

    obs.subscribe(
      (notes:Note[]) => {
        this._notes.next(notes)
      }
    );

    return obs;
  }

  addNote (note: Note) {
    let obs = this.notesDatabase.addNote(note);

    obs.subscribe(
      (res) => {
        this._notes.next(this._notes.getValue().concat([note]));
      }
    );

    return obs;
  }

  deleteNote (deleted: Note) {
    let obs = this.notesDatabase.deleteNote(deleted);

    obs.subscribe(
      res => {
        let notes = this._notes.getValue();
        let index = notes.findIndex((note) => note._id === deleted._id);
        let deletedNotes = notes.splice(index, 1)
        this._notes.next(notes);
      }
    );

    return obs;
  }

  updateNote () {

  }

  searchNotes (term: string) {
    let obs = this.notesDatabase.searchNotes(term);

    obs.subscribe(
      ((notes:Note[]) => {
        this._notes.next(notes);
      })
    );

    return obs;
  }

}