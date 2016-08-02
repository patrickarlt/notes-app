import 'core-js/es6';
import 'reflect-metadata';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent } from './app.component';
import { appRouterProviders } from './app.routes';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

require('zone.js/dist/zone');

if (process.env.ENV === 'production') {
  // Production
} else {
  // Development
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}

if (process.env.ENV === 'production') {
  enableProdMode();
}

bootstrap(AppComponent, [
  appRouterProviders,
  disableDeprecatedForms(),
  provideForms()
])
.catch(err => console.error(err));