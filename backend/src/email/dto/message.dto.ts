export class MessageDTO {
  to: string;
  subject: string;
  text: string;

  constructor(from: string, to: string, subject: string, text: string) {
    this.to = to;
    this.subject = subject;
    this.text = text;
  }
}
