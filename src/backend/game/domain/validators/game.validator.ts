import { ClassValidatorFields } from "@/backend/@seedwork/domain/validators/class-validator-fields";
import {
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { GameProps } from "../entities/game";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { GameTeam } from "../value-objects/game-team.vo";
import { DiffValue } from "@/backend/@seedwork/domain/validators/rules/diff-value.rule";

export class GameRules {
  @IsNotEmptyObject()
  @IsNotEmpty()
  tenant_id!: TenantId;

  @IsDate()
  @IsNotEmpty()
  date!: Date;

  @MinLength(3)
  @MaxLength(255)
  @IsString()
  @IsOptional()
  place!: string;

  @IsNotEmptyObject()
  @IsNotEmpty()
  home!: GameTeam[];

  @DiffValue("home", "id")
  @IsNotEmptyObject()
  @IsNotEmpty()
  away!: GameTeam[];

  constructor({ tenant_id, date, place, home, away }: GameProps) {
    Object.assign(this, { tenant_id, date, place, home, away });
  }
}

export class GameValidator extends ClassValidatorFields<GameRules> {
  validate(data: GameProps): boolean {
    return super.validate(new GameRules(data ?? ({} as any)));
  }
}

export class GameValidatorFactory {
  static create() {
    return new GameValidator();
  }
}
