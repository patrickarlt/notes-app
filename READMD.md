# Sample Angular 2.0 App

This app is a port of [Notational Velocoity](http://notational.net/) for the web written using Webpack, Angular 2.0, Typescript 2.0 and PouchDB.

## Why Webpack?

WebPack has proven itself to be capable of bunding a wide variety of assets including our site wide JavaScript, Custom Elements, Angular 1.0 apps, and Angular 2.0 apps.

In addition to module bundling Webpack also can handle minification and optimization of assets, multiple input and output modules, and a built in development server.

**Pros:**

* Flexible
* Fast
* Built-in dev server

**Cons:**

* Complex configuration

## Why Angular 2.0?

Angular 2.0 has many of the benifits of Angular 1.0, it feels extremely fast to develop with, is extremely modular and strikes a nice balance of opinions and flexibility without a huge amount of tooling overhead.

**Pros:**

* Component strucutre is easy to understand
* Feels much more like writing "vanilla JavaScript" then Angular 1.0

**Cons:**

* Typescript can feel confusing at times
* Observables can feel confusing at times
* Some documentation is still in progress, particularly around testing and interacting directly with the DOM.

## Why Typescript 2.0?

Previous attempts to use Typescript on ArcGIS for Developers has run into issues with attempting to integrate 3rd party code, particularly from NPM. Typescript 2.0 has a new syntax to help with. Coupled with improved documentation from the community makes integrating 3rd party modules extremely simple.

**Pros:**

* Easier declaration of untyped modules
* ES 6 compiler with much less setup and dependencies
* Documentation around using modules from NPM has greatly improved

**Cons:**

* Occassionally gets in the way, for example creating an `EventEmitter` that doesn't need a parameter.

## Challanges

**Importing 3rd Party Code**

Previously using 3rd party code (particularly from NPM) with Typescript was a struggle but to missing or incorrect typings. Typescript 2.0 allows for a new syntax to declaring typing for modules however. In a `.d.ts` (Typescript's file format for type declarations) put the following:

```ts
declare module "MODULE_NAME";
```

The Typescript compiler loads all the declaration files (`.d.ts`) before it compiles so this tells Typescript to expect a module called `MODULE_NAME` and that its type should be `any`, i.e. don't bother doing any type checking.

To import our newly declared module you can use the following syntax:

```ts
import * as DefaultExport from 'MODULE_NAME';
```

This is equivilant to the following that you might recognize from Node:

```js
var DefaultExport = require('MODULE_NAME');
```

**Understanding RxJS and Observables**

Observables proved to both the more confusing and most useful part of Angular 2. Conceptually Observables are difficult to understand but due to Angular 2's tight integration with them it was difficult to try to work around them. Instead working heaviliy with Observables proved to be benifitical.

I used Observables heaviliy in some parts of the app:

* The `NotesStore` service uses BehaviorSubject to represent the list of notes that changes over time. Any action on the `NoteStore` updates the list of notes and changes get propagated to components automatically.
* The `NoteEditorComponent` uses an Observable provided by the `NgForm` directive to listen to any change in any value on the form, throttle the changes and update the note in the local database to impliment an "autosave" feature.

I ran into significant problems using `Observable.fromPromise()` with PouchDB. This often resulted in conflicts when deleteing notes. In general this lead me to belive that if you already have a Promise based API it probally isn't worth converting it to an Observable.

It is also worth noting that [Reactive-Extensions/RxJS](https://github.com/Reactive-Extensions/RxJS) and [ReactiveX/rxjs](https://github.com/ReactiveX/rxjs) are different things. Both are very similar and I found that documentation for one tended to work in the other but there were minor differences. In general use the later.

**Forms**

Working with forms in the way I wanted too was rather difficult. I wanted to get a stream of events from the editor form so I could impliment autosave. I also needed this same use case to impliment the live search for the notes list and found out that it was rather tricky to choose the right approach. I think this was mostly because of my use case of wanting to impliment live searching and autosaving rather then a typical workflow where you submit the form.

Adding to the complexity if the fact that Angular 2 has 2 different form APIs. A deprecated one `angular2/forms` and the newer one `@angular/forms`. This is also componded by the fact that there are 2 different ways to create forms, the simpler "template driven" way shown in the official Angular 2 docs and the more complex "form builder".

Overall though I think Angular 2 will easily meet our needs concerning forms since they are fairly standard and there are plenty of examples and documentation.

## App Architecture

Quite a bit has been written about the open ended nature of building Angular 2 applications, I read through several posts about managing state in Angular 2 before coming up with the architecture used for this app:

* [Managing state in Angular 2 applications](https://vsavkin.com/managing-state-in-angular-2-applications-caf78d123d02)
* [How to build Angular 2 apps using Observable Data Services - Pitfalls to avoid](http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/)
*[Angular 2 Application Architecture - Building Flux Apps with Redux and Immutable.js](http://blog.angular-university.io/angular-2-application-architecture-building-flux-like-apps-using-redux-and-immutable-js-js/)
* [Angular 2 Application Architecture - Building Redux-like apps using RxJs](http://blog.angular-university.io/angular-2-application-architecture-building-applications-using-rxjs-and-functional-reactive-programming-vs-redux/)

In the end I choose an approach based on a simplified version of [Observable Data Services](http://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/). It works like this:

* A "Store" service (`NotesStore`) exposes an Observable to components.
* Components subscribe to the `Observable` to get updates whenever the data in the store changes.
* Components can update the store via "action methods" on the store, for example `updateNote()`, `deleteNote()`, ect... these methods alter the Observable causing ALL subscribers to the data to update.
* Components never talk to the backend APIs directly. The `NotesStore` talks to a `NotesDatabase` service which handles the transactions.
* Components should only get data via a subscription to an `Observable` exposed by a store or via an `@Input` those value will come from a stores `Observable`.

I think this approach has a few advatages:

* Few additional dependencies. Just RxJS which is already needed for most Angular 2 tasks like event handing and http requests. Many other app architectures involve additional dependencies on Redux and/or Immutable.js which feels like lots of bloat and additional APIs to learn.
* Stores become a single point of truth for the application. All data flows down from Stores into components. Stores also act as a caching layer for holding data in memory so we can reduce the number of requests we have to make.
* Functionality can easily be split up amoung many stores. For example I have both a `NotesStore` and a `SearchResultsStore` that handle different parts of the UI that the component combines into the proper display.

## Learning Angular 2.0

I made use of a lot of resources to learn Angular 2. Only use articles that are updated for RC 4 for later, or use the `@angular` modules in their `import` statements. I generally did things in the following order:

* Do the [Quickstart](https://angular.io/docs/ts/latest/quickstart.html)
* Do the [Tutorial](https://angular.io/docs/ts/latest/tutorial/)
* Read the [Basics](https://angular.io/docs/ts/latest/guide/) but skip the "Angular Cheat Sheet" and the "Glossary"
* A few topics in the "Developers Guide" are patricularly useful:
  * [HTTP Client](https://angular.io/docs/ts/latest/guide/server-communication.html)
  * [Lifecycle Hooks](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html)
  * [Pipes](https://angular.io/docs/ts/latest/guide/pipes.html)
  * [Routing and Navigation](https://angular.io/docs/ts/latest/guide/router.html)
  * [Testing](https://angular.io/docs/ts/latest/guide/testing.html)
  * [Webpack: an introduction](https://angular.io/docs/ts/latest/guide/webpack.html)

I also found serveral external resources very helpful for building specific parts of this application:

* [Core Concepts of Angular 2](https://vsavkin.com/the-core-concepts-of-angular-2-c3d6cbe04d04#.5oqg2kdeb)
* [Angular 2 Template Syntax](https://vsavkin.com/angular-2-template-syntax-5f2ee9f13c6a)
* [Writing Angular 2 in TypeScript](https://vsavkin.com/writing-angular-2-in-typescript-1fa77c78d8e8)
* [Change Detection in Angular 2](https://vsavkin.com/change-detection-in-angular-2-4f216b855d4c)
* [Functional Reactive Programming for Angular 2 Developers - RxJs and Observables](http://blog.angular-university.io/functional-reactive-programming-for-angular-2-developers-rxjs-and-observables/)
* [Introduction to Angular 2 Forms - Template Driven, Model Driven or In-Between](http://blog.angular-university.io/introduction-to-angular-2-forms-template-driven-vs-model-driven/) - Does a pretty good job at explaining the differences between the 2 form types.
* [Angular 2 Change Detection Explained](http://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html)
* [Angular 2: Connect your custom control to ngModel with Control Value Accessor](http://almerosteyn.com/2016/04/linkup-custom-control-to-ngcontrol-ngmodel) - Helped me figure out how to make custom form inputs.
* [Custom form controls in Angular 2](http://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html) - Another article that helped me figure out how to make custom form inputs.
* [Angular 2 Router Introduction - Child Routes, Auxiliary Routes, Avoid Common Pitfalls](http://blog.angular-university.io/angular2-router/)
* [Dependency Injection in Angular 2](http://blog.thoughtram.io/angular/2015/05/18/dependency-injection-in-angular-2.html)
* [Forward References in Angular 2](http://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html)