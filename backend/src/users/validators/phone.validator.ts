import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class PhoneValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(phone: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    return !user;
  }

  defaultMessage(): string {
    return 'Phone number provided has already been registered';
  }
}

export function PhoneIsUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: PhoneValidator,
    });
  };
}
