/**
 * Imports the basic polyfills needed by Angular 2.
 * This is directly from the Quickstart and the Webpack docs.
 *
 * https://angular.io/docs/ts/latest/quickstart.html
 * https://angular.io/docs/ts/latest/guide/webpack.html
 */
import 'core-js/es6';
import 'reflect-metadata';

/**
 * Import the Angular 2 core and bootstraping function.
 * Again this is from the Quickstart and the Webpack docs.
 *
 * https://angular.io/docs/ts/latest/quickstart.html
 * https://angular.io/docs/ts/latest/guide/webpack.html
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

/**
 * Import the root level AppComponent and the routes for this app
 */
import { AppModule } from './app.module';

/**
 * Require the Zone.js polyfill required for Angular 2's change detection.
 * This is directly from the Quickstart and the Webpack docs.
 *
 * https://angular.io/docs/ts/latest/quickstart.html
 * https://angular.io/docs/ts/latest/guide/webpack.html
 */
require('zone.js/dist/zone');

/**
 * process.env.ENV is set by the webpack configuration depending on which build we are doing. We can use this to create different builds in dev and production.
 *
 * https://angular.io/docs/ts/latest/guide/webpack.html
 */
if (process.env.ENV === 'production') {
  enableProdMode();
} else {
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}

/**
 * Call the bootstraping function to start the application, making sure
 * to pass in the providers that we need for various things like forms
 *  and routes.
 *
 * https://angular.io/docs/ts/latest/quickstart.html
 * https://angular.io/docs/ts/latest/guide/webpack.html
 * https://angular.io/docs/ts/latest/guide/forms.html#!#bootstrap
 * https://angular.io/docs/ts/latest/guide/router.html#!#route-config
 */
platformBrowserDynamic().bootstrapModule(AppModule);