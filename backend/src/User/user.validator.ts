import { Inject, Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
@ValidatorConstraint({async: true})
export class EmailValidator implements ValidatorConstraintInterface {
    @Inject()
    prisma: PrismaService;

    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const [result] = await this.prisma.$queryRaw<
            { exists: boolean }[]
        >`SELECT EXISTS(SELECT 1 FROM "User" WHERE email = ${value}) AS "exists"`;
        return result.exists;
    }
}

export const EmailIsUnique = (validatorOptions: ValidationOptions) => {
    return(object: Object, property: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: property.toString(),
            options: validatorOptions,
            constraints: [],
            validator: EmailValidator
        });
    }
}