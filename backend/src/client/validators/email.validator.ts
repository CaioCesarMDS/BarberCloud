import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EmployeeRepository } from '../client.repository';

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async validate(email: string): Promise<boolean> {
    const employee = await this.employeeRepository.findByEmail(email);
    return !employee;
  }

  defaultMessage(): string {
    return 'Email provided has already been registered';
  }
}

export const EmailIsUnique = (validatorOptions?: ValidationOptions) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validatorOptions,
      constraints: [],
      validator: EmailValidator,
    });
  };
};
