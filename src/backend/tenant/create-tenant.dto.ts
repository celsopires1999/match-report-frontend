import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Validator } from "../@seedwork/validator";
import { EntityValidationError } from "../@seedwork/errors";

export class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name!: string;

  private constructor(body: any) {
    this.name = body.name
  }

  static validate(body: any) {
    const dto = new CreateTenantDto(body)
    const validator = new Validator(dto);
    if (!validator.validate()) {
      throw new EntityValidationError(validator.errors)
    }
    return dto
  }
}
