import { ClassValidatorFields } from "@/backend/@seedwork/domain/validators/class-validator-fields";
import { PlayerId } from "@/backend/player/domain/entities/player";
import { TeamId } from "@/backend/team/domain/entities/team";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { IsInstance, IsNotEmpty, IsNotEmptyObject } from "class-validator";
import { TeamPlayerProps } from "../entities/team-player";

export class TeamRules {
  @IsNotEmptyObject()
  @IsNotEmpty()
  @IsInstance(TenantId)
  tenant_id!: TenantId;

  @IsNotEmptyObject()
  @IsNotEmpty()
  @IsInstance(TeamId)
  team_id!: TeamId;

  @IsNotEmptyObject()
  @IsNotEmpty()
  @IsInstance(PlayerId)
  player_id!: PlayerId;

  constructor({ tenant_id, team_id, player_id }: TeamPlayerProps) {
    Object.assign(this, { tenant_id, team_id, player_id });
  }
}

export class TeamPlayerValidator extends ClassValidatorFields<TeamRules> {
  validate(data: TeamPlayerProps): boolean {
    return super.validate(new TeamRules(data ?? ({} as any)));
  }
}

export class TeamPlayerValidatorFactory {
  static create() {
    return new TeamPlayerValidator();
  }
}
