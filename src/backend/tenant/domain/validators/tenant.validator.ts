import { ClassValidatorFields } from "@/backend/@seedwork/domain/validators/class-validator-fields";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";
import { TenantProps } from "../entities/tenant";

export class PlayerRules {
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name!: string;

  constructor({ name }: TenantProps) {
    Object.assign(this, { name });
  }
}

export class TenantValidator extends ClassValidatorFields<PlayerRules> {
  validate(data: TenantProps): boolean {
    return super.validate(new PlayerRules(data ?? ({} as any)));
  }
}

export class TenantValidatorFactory {
  static create() {
    return new TenantValidator();
  }
}
