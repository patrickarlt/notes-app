import { Injectable, Inject } from '@angular/core';
import { Database } from './db';
import { Note } from './note';

@Injectable()
export class NoteService {
  constructor (
    @Inject(Database) private database
  ) {}

  getNote (id: string) :Promise<Note> {
    return this.database.get(id).then((doc) => {
      doc.created = new Date(doc.created);
      doc.edited = new Date(doc.edited);
      return doc;
    });
  }

  updateNoteContent (id: string, content: string) :Promise<Note> {
    return this.database.get(id).then((doc) => {
      doc.content = content;
      doc.title = this.getTitleFromContent(content);
      doc.edited = new Date();
      return this.database.put(doc);
    }).then(()=> {
      return this.getNote(id);
    });
  }

  updateNoteTags (id: string, tags: string[]) :Promise<Note> {
    return this.database.get(id).then((doc) => {
      doc.tags = tags;
      doc.edited = new Date();
      return this.database.put(doc);
    }).then(()=> {
      return this.getNote(id);
    }).then(function (note) {
      return note;
    });
  }

  deleteNote (id: string) :Promise<void> {
    return this.database.get(id).then((doc) => {
      return this.database.remove(doc);
    })
  }

  getTitleFromContent (content: string) :string {
    return content.split('\n')[0].replace(/^[#\*-1\d.\s]+/, '');
  }

  createNoteFromTitle (title: string) :Promise<Note> {
    return this.database.post({
      title,
      content: `# ${title}`,
      created: new Date(),
      edited: new Date(),
      tags: []
    }).then((response) => {
      return this.getNote(response.id);
    });
  }
}
