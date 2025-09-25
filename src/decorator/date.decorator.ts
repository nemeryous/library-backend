import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';

function isValidDateString(date: string): boolean {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!dateRegex.test(date)) {
        return false;
    }

    // Check if the date is valid using JavaScript's Date
    const [year, month, day] = date.split('-').map(Number);
    if (!year || !month || !day) {
        return false;
    }

    const dateObj = new Date(year, month - 1, day);
    return (
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day
    );
}

@ValidatorConstraint({async: false})
export class IsDateStringConstraint implements ValidatorConstraintInterface {

    validate(date: string): boolean {
        return isValidDateString(date);
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property ?? 'Date'} must be a valid date in the format YYYY-MM-DD.`;
    }
}

@Injectable()
export class DateString implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any {
        if (!isValidDateString(value)) {
            throw new BadRequestException(`Invalid date value for ${metadata.data}.`);
        }
        return value;
    }
}

export function IsDateString(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsDateStringConstraint,
        });
    };
}
