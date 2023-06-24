import { Entity } from "@/backend/@seedwork/domain/entities/entity";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { UniqueEntityId } from "@/backend/@seedwork/domain/value-objects/unique-entity-id.vo";
import { PlayerId } from "@/backend/player/domain/entities/player";
import { TeamId } from "@/backend/team/domain/entities/team";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { TeamPlayerValidatorFactory } from "../validators/team-player.validator";

export type TeamPlayerProps = {
  tenant_id: TenantId;
  team_id: TeamId;
  player_id: PlayerId;
};

export type TeamPlayerPropsJson = Required<
  { id: string } & {
    tenant_id: string;
    team_id: string;
    player_id: string;
  }
>;

export class TeamPlayerId extends UniqueEntityId {}

export class TeamPlayer extends Entity {
  constructor(public readonly props: TeamPlayerProps, entityId?: TeamPlayerId) {
    TeamPlayer.validate(props);
    super(props, entityId ?? new TeamPlayerId());
    this.tenant_id = props.tenant_id;
    this.team_id = props.team_id;
    this.player_id = props.player_id;
  }

  get tenant_id(): TenantId {
    return this.props.tenant_id;
  }

  private set tenant_id(value: TenantId) {
    this.props.tenant_id = value;
  }

  get team_id(): TeamId {
    return this.props.team_id;
  }

  private set team_id(value: TeamId) {
    this.props.team_id = value;
  }

  get player_id(): PlayerId {
    return this.props.player_id;
  }

  private set player_id(value: PlayerId) {
    this.props.player_id = value;
  }

  static validate(props: TeamPlayerProps) {
    const validator = TeamPlayerValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON(): TeamPlayerPropsJson {
    return {
      ...this.props,
      id: this.id.toString(),
      tenant_id: this.tenant_id.value,
      team_id: this.team_id.value,
      player_id: this.player_id.value,
    } as TeamPlayerPropsJson;
  }
}
