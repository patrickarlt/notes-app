import * as PouchDB from 'pouchdb';
import * as PouchDBQuickSearch from 'pouchdb-quick-search';
const Config = require('../config.json');

PouchDB.plugin(PouchDBQuickSearch);

const LOCAL = new PouchDB('notes_dev_2');

LOCAL.on('error', function (err) { debugger; });

export { LOCAL as Database};