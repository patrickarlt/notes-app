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

Observables are one of the more confusing parts of Angular 2. They are used in a varity of places for dealing with both HTTP requests and DOM events. Observalbes seems ideal for some cases, like processing a stream of input (for search) but for others Promises still seemed like a much better option because they were easier to chain.

**Webpack and CSS**



**Webpack and External Templates**