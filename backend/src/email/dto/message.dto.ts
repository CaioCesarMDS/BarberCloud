export class MessageDTO {
  from: string;
  to: string;
  subject: string;
  text: Record<string, any>;

  constructor(
    from: string,
    to: string,
    subject: string,
    text: Record<string, any>,
  ) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;
  }
}
