import { Injectable, Inject } from '@angular/core';
import { Database } from './db';
import { Note } from './note';

@Injectable()
export class NotesDatabaseService {
  constructor (
    @Inject(Database) private database
  ) { }

  getAllNotes () :Promise<Note[]> {
    return this.database.allDocs({
      include_docs: true
    })
    .then((response: any) => {
      return response.rows
        .map(row => row.doc)
        .map(doc => {
          doc.created = new Date(doc.created);
          doc.edited = new Date(doc.edited);
          return doc;
        });
    });
  }

  getNote (id: string) :Promise<Note> {
    return this.database.get(id)
      .then((document: any)=> {
        document.created = new Date(document.created);
        document.edited = new Date(document.edited);
        return document;
      });
  }

  addNote(note: Note) :Promise<Note> {
    return this.database.post(note)
    .then((response: any) => {
      return this.getNote(response.id);
    });
  }

  updateNote(updatedNote: Note) :Promise<Note> {
    return this.getNote(updatedNote._id)
    .then((note: Note) => {
      updatedNote._rev = note._rev;
      return this.database.put(updatedNote);
    })
    .then((response: any) => {
      return this.getNote(response.id);
    });
  }

  deleteNote(note: Note) :Promise<boolean> {
    return this.getNote(note._id)
      .then((note: Note) => {
        return this.database.remove(note);
      });
  }

  searchNotes (term: String) :Promise<Note[]> {
    if (term.length <= 0) {
      return this.getAllNotes();
    }

    return this.database.search({
      query: term,
      fields: ['title', 'tags'],
      include_docs: true,
      highlighting: true
    })
    .then((response: any) => {
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