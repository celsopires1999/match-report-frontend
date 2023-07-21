import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function DiffValue(
  property: string,
  attribute: string,
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property, attribute],
      validator: DiffValueConstraint,
    });
  };
}

@ValidatorConstraint({ name: "DiffValue" })
export class DiffValueConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName, attribute] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!value?.value || !relatedValue?.value) return true;

    return value.value[attribute] !== relatedValue.value[attribute];
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} and ${args.property} must be different`;
  }
}
