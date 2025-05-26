import { Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
@ValidatorConstraint({ async: true })
export class EmailValidator implements ValidatorConstraintInterface {
    @Inject()
    prisma: PrismaService;

    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const [result] = await this.prisma.$queryRaw<
            { exists: boolean }[]
        >`SELECT EXISTS(SELECT 1 FROM "User" WHERE email = ${value}) AS "exists"`;
        return !result.exists;
    }

    defaultMessage(): string {
        return "email provided has already been registered";
    }
}

export const EmailIsUnique = (validatorOptions: ValidationOptions) => {
    return (object: Object, property: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: property.toString(),
            options: validatorOptions,
            constraints: [],
            validator: EmailValidator
        });
    }
}

@Injectable()
@ValidatorConstraint({ async: true })
export class PhoneValidator implements ValidatorConstraintInterface {
    @Inject()
    prisma: PrismaService;

    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const [result] = await this.prisma.$queryRaw<
            { exists: boolean }[]
        >`SELECT EXISTS(SELECT 1 FROM "User" WHERE phone = ${value}) AS "exists"`;
        return !result.exists;
    }

    defaultMessage(): string {
        return "phone provided has already been registered";
    }
}

export const PhoneIsUnique = (validatorOptions: ValidationOptions) => {
    return (object: Object, property: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: property.toString(),
            options: validatorOptions,
            constraints: [],
            validator: PhoneValidator
        });
    }
}