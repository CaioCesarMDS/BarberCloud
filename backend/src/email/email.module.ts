import { Module } from '@nestjs/common';
import { MailerModule } from 'src/mail/mail.module';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [MailerModule],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
