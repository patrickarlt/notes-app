import { Injectable, Inject } from '@angular/core';
import { Database } from './db';
import { Note } from './note';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class NotesDatabaseService {
  constructor (
    @Inject(Database) private database
  ) { }

  getAllNotes () :Observable<Note[]> {
    return Observable.fromPromise(this.database.allDocs({
      include_docs: true
    }))
      .map((response: any) => {
        return response.rows
          .map(row => row.doc)
          .map(doc => {
            doc.created = new Date(doc.created);
            doc.edited = new Date(doc.edited);
            return doc;
          });
      });
  }

  getNote (id: string) :Observable<Note> {
    return Observable.fromPromise(this.database.get(id))
      .map((document: any) => {
        document.created = new Date(document.created);
        document.edited = new Date(document.edited);
        return document;
      });
  }

  addNote(note: Note) :Observable<Note> {
    return Observable.fromPromise(this.database.post(note))
    .flatMap((response: any) => {
      return this.getNote(response.id);
    });
  }

  updateNote(note: Note) :Observable<Note> {
    return Observable.fromPromise(this.database.post(note))
    .flatMap((response: any) => {
      return this.getNote(response.id);
    });
  }

  deleteNote(note: Note) :Observable<any> {
    return Observable.fromPromise(this.database.remove(note))
  }

  searchNotes (term: String) :Observable<Note[]> {
    if (term.length <= 0) {
      return this.getAllNotes();
    }

    return Observable.fromPromise(this.database.search({
      query: term,
      fields: ['title', 'tags'],
      include_docs: true,
      highlighting: true
    }))
      .map((response: any) => {
        return response.rows
          .map(row => row.doc)
          .map(doc => {
            doc.created = new Date(doc.created);
            doc.edited = new Date(doc.edited);
            return doc;
          });
      });
  }
}