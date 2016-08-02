import { Injectable, Inject } from '@angular/core';
import { Database } from './db';
import { Note } from './note';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';

@Injectable()
export class NotesService {
  constructor (
    @Inject(Database) private database
  ) { }

  getAllNotes () :Observable<Note> {
    return Observable.fromPromise(this.database.allDocs({
      include_docs: true
    }))
    .map(this.queryToNotes);
  }

  search (term: string) :Observable<Note[]> {
    return Observable.fromPromise(this.database.search({
      query: term,
      fields: ['title', 'tags'],
      include_docs: true,
      highlighting: true
    }))
    .map(this.queryToNotes);
  }

  private queryToNotes (response: any) {
    return response.rows
      .map(row => row.doc)
      .map(doc => {
        doc.created = new Date(doc.created);
        doc.edited = new Date(doc.edited);
        return doc;
      });
  }
}
