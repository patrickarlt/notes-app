import { Injectable } from '@angular/core';
import { NotesDatabaseService } from './notes-db.service';
import { Note } from './note';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * This service is a store for the results of a search. It is used in the
 * <notes-list> component.
 */
@Injectable()
export class SearchResultsStore {
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
  private _results = new BehaviorSubject<string[]>([])

  /**
   * We don't want to expose the results BehaviorSubject to the rest of our
   * application. We only want our application to subscribe to changes and call
   * the methods on the store. So we can expose the results as an Observable so
   * consumers of the store cannot call `next` on the BehaviorSubject and emit
   * a new value.
   *
   * http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
   */
  get results () :Observable<string[]> {
    return this._results.asObservable();
  }

  /**
   * This method call the notes database and updates the value of the results
   * by calling `next` with the new value. This will then update all subscribers
   * and the components views will udpate.
   */
  search (term: string) :Promise<string[]> {
    return this.notesDatabase.searchNotes(term)
      .then((ids) => {
        this._results.next(ids);
        return ids;
      });
  }
}