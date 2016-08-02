import { Pipe, PipeTransform } from '@angular/core';
import MarkdownIt = require('markdown-it');

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
