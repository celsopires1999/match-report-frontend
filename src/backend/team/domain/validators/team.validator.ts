import { ClassValidatorFields } from "@/backend/@seedwork/domain/validators/class-validator-fields";
import {
  IsInstance,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { TeamProps } from "../entities/team";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";

export class TeamRules {
  @MinLength(3)
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmptyObject()
  @IsNotEmpty()
  @IsInstance(TenantId)
  tenant_id!: TenantId;

  constructor({ name, tenant_id }: TeamProps) {
    Object.assign(this, { name, tenant_id });
  }
}

export class TeamValidator extends ClassValidatorFields<TeamRules> {
  validate(data: TeamProps): boolean {
    return super.validate(new TeamRules(data ?? ({} as any)));
  }
}

export class TeamValidatorFactory {
  static create() {
    return new TeamValidator();
  }
}
