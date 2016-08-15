/**
 * This is a basic Note model. We don't use this in code anywhere. It is used to
 * Tell Typescript when we use a Note vs useing `any` object for extra type
 * checking. Note that `_id` and `_rev` are optional.
 */
export class Note {
  public title: string;
  public content: string;
  public created: Date;
  public edited: Date;
  public tags: string[];
  public _id?: string;
  public _rev?: string;
}