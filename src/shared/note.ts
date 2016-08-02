export class Note {
  public title: string;
  public content: string;
  public created: Date;
  public edited: Date;
  public tags: string[];
  public _id?: string;
  public _rev?: string;
}