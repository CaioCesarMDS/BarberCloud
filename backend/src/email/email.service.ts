import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MessageDTO } from './dto/message.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(data: MessageDTO): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: data.to,
        from: data.from,
        subject: data.subject,
        text: JSON.stringify(data.text, null, 2),
      });
      console.log(`Email sent to ${data.to} successfully.`);
    } catch (error) {
      console.error(`Failed to send email to ${data.to}:`, error);
    }
  }
}
