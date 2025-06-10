export class MessageDTO {
  from: string;
  to: string;
  subject: string;
  text: string;

  constructor(from: string, to: string, subject: string, text: string) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.text = text;
  }
}
