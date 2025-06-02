import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class PhoneValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(phone: string): Promise<boolean> {
    const [result] = await this.prisma.$queryRaw<
            { exists: boolean }[]
        >`SELECT EXISTS(SELECT 1 FROM "User" WHERE phone = ${phone}) AS "exists"`;
        return !result.exists;
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
