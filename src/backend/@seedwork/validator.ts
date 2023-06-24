import { validateSync } from "class-validator";

export type FieldsErrors = {
  [field: string]: string[];
};

export class Validator {
  errors: FieldsErrors = {};

  constructor(private readonly data: any) { }

  validate() {
    const errors = validateSync(this.data)
    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = error.constraints
          ? Object.values(error.constraints)
          : [""];
      }
      // throw new EntityValidationError(this.errors)
    }
    return !errors.length
  }
}
