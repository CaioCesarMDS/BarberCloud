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
export class EmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(email: string): Promise<boolean> {
    const employee = await this.prisma.employee.findUnique({
      where: { email },
    });
    const client = await this.prisma.client.findUnique({ where: { email } });
    if (email == employee?.email || email === client?.email) {
      return true;
    } else {
      if (employee) {
        return !employee;
      } else {
        return !client;
      }
    }
  }

  defaultMessage(): string {
    return 'Email provided has already been registered';
  }
}

export const EmailIsUnique = (validatorOptions?: ValidationOptions) => {
  return (object: object, property: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: property.toString(),
      options: validatorOptions,
      constraints: [],
      validator: EmailValidator,
    });
  };
};
