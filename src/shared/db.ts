import * as PouchDB from 'pouchdb';
import * as PouchDBQuickSearch from 'pouchdb-quick-search';

/**
 * Basic initalization of the PouchDB database.
 */
PouchDB.plugin(PouchDBQuickSearch);

const Database = new PouchDB('notes_dev');

export {Database as Database};