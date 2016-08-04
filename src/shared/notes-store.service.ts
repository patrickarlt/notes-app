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

  private _notes = new BehaviorSubject<Note[]>([])

  get notes () :Observable<Note[]> {
    return this._notes.asObservable();
  }

  loadNote (id: string) :Promise<Note> {
    return this.notesDatabase.getNote(id)
      .then((note: Note) => {
        let notes = this._notes.getValue();
        let index = notes.findIndex((note) => {
          return note._id === id;
        });

        if(index === -1) {
          notes.push(note);
        } else {
          notes[index] = note;
        }

        this._notes.next(notes);

        return note;
      });
  }

  loadNotes () :Promise<Note[]> {
    return this.notesDatabase.getAllNotes()
      .then((notes:Note[]) => {
        this._notes.next(notes);
        return notes;
      });
  }

  addNote (note: Note) :Promise<Note> {
    return this.notesDatabase.addNote(note)
      .then((note: Note) => {
        this._notes.next(this._notes.getValue().concat([note]));
        return note;
      });
  }

  deleteNote (deleted: Note) :Promise<Boolean> {
    return this.notesDatabase.deleteNote(deleted)
    .then((success) => {
      let notes = this._notes.getValue();
      let index = notes.findIndex((note) => note._id === deleted._id);
      let deletedNotes = notes.splice(index, 1)
      this._notes.next(notes);
      return success;
    });
  }

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

  searchNotes (term: string) :Promise<Note[]> {
    return this.notesDatabase.searchNotes(term).then((notes:Note[]) => {
      this._notes.next(notes);
      return notes;
    });
  }
}