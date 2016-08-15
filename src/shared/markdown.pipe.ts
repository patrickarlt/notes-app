import { Pipe, PipeTransform } from '@angular/core';
import MarkdownIt = require('markdown-it');

/**
 * This is a basic implimenation of a Pipe the converts strings of Markdown to
 * HTML. You can see it used in the template for <note-preview>.
 *
 * https://angular.io/docs/ts/latest/guide/pipes.html
 */

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
});

@Pipe({name: 'markdown'})
export class MarkdownPipe implements PipeTransform {
  transform(markdown?: string): string {
    return markdown ? md.render(markdown) : '';
  }
}
