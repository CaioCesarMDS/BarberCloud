import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessageDTO } from './dto/message.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('email.send')
  handleEmailSend(@Payload() data: MessageDTO) {
    return this.emailService.sendEmail(data);
  }
}
