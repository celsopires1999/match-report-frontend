import { ClassValidatorFields } from "@/backend/@seedwork/domain/validators/class-validator-fields";
import {
  IsInstance,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { PlayerProps } from "../entities/player";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";

export class PlayerRules {
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmptyObject()
  @IsNotEmpty()
  @IsInstance(TenantId)
  tenant_id!: TenantId;

  constructor({ name, tenant_id }: PlayerProps) {
    Object.assign(this, { name, tenant_id });
  }
}

export class PlayerValidator extends ClassValidatorFields<PlayerRules> {
  validate(data: PlayerProps): boolean {
    return super.validate(new PlayerRules(data ?? ({} as any)));
  }
}

export class PlayerValidatorFactory {
  static create() {
    return new PlayerValidator();
  }
}
