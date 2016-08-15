import { Injectable, Inject } from '@angular/core';
import { Database } from './db';
import { Note } from './note';

/**
 * This service abstacts the PouchDB instance we use into an Angular service.
 */
@Injectable()
export class NotesDatabaseService {
  /**
   * This is the simplest method I found to inject the PouchDB instance into the
   * service. I have a feeling there is a better way to do this though.
   *
   * https://angular.io/docs/ts/latest/guide/dependency-injection.html#!#non-class-dependencies
   */
  constructor (
    @Inject(Database) private database
  ) { }

  /**
   * This method retrives all notes from the database and casts then into `Note`
   * objects before returning the Promise.
   */
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

  /**
   * Gets a single note from the database and cast it to a `Note` object before
   * returning the Promise.
   */
  getNote (id: string) :Promise<Note> {
    return this.database.get(id)
      .then((document: any)=> {
        document.created = new Date(document.created);
        document.edited = new Date(document.edited);
        return document;
      });
  }

  /**
   * Adds a note to the database returning a new promise that gets the note
   * from the database.
   */
  addNote(note: Note) :Promise<Note> {
    return this.database.post(note)
      .then((response: any) => {
        return this.getNote(response.id);
      });
  }

  /**
   * Updates a note to the database returning a new promise that gets the note
   * from the database.
   */
  updateNote(updatedNote: Note) :Promise<Note> {
    return this.database.put(updatedNote)
      .then((response: any) => {
        return this.getNote(response.id);
      });
  }

  /**
   * Deletes a note from the database.
   */
  deleteNote(note: Note) :Promise<any> {
    return this.database.remove(note);
  }

  /**
   * Searching the database for a specific term. Returning the IDs of notes
   * that match.
   */
  searchNotes (term: String) :Promise<string[]> {
    return this.database.search({
      query: term,
      fields: ['title', 'tags', 'content']
    })
    .then((response: any) => {
      return response.rows.map(row => row.id)
    });
  }
}