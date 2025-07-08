import { Injectable } from '@nestjs/common';
import { MailerService } from 'src/mail/mail.service';
import { MessageDTO } from './dto/message.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendEmail(data: MessageDTO): Promise<void> {
    await this.mailService.sendMail(data.to, data.subject, data.text);
  }
}
