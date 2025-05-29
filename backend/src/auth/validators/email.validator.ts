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
    const [result] = await this.prisma.$queryRaw<
            { exists: boolean }[]
        >`SELECT EXISTS(SELECT 1 FROM "User" WHERE email = ${email}) AS "exists"`;
        return !result.exists;
  }

  defaultMessage(): string {
    return 'Email provided has already been registered';
  }
}

export const EmailIsUnique = (validatorOptions: ValidationOptions) => {
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
