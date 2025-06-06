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
export class PhoneValidator implements ValidatorConstraintInterface {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async validate(phone: string): Promise<boolean> {
    const Employee = await this.employeeRepository.findByPhone(phone);
    return !Employee;
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
