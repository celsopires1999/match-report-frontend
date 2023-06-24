import { Entity } from "@/backend/@seedwork/domain/entities/entity";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { UniqueEntityId } from "@/backend/@seedwork/domain/value-objects/unique-entity-id.vo";
import { GameValidatorFactory } from "../validators/game.validator";
import { GameTeam, GameTeamJson } from "../value-objects/game-team.vo";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";

export type GameProps = {
  tenant_id: TenantId;
  date: Date;
  place: string | null;
  home: GameTeam;
  away: GameTeam;
};

export type GamePropsJson = {
  id: string;
  tenant_id: string;
  date: Date;
  place: string | null;
  home: GameTeamJson;
  away: GameTeamJson;
};

export class GameId extends UniqueEntityId {}

export class Game extends Entity {
  constructor(public readonly props: GameProps, entityId?: GameId) {
    Game.validate(props);
    super(props, entityId ?? new GameId());
    this.tenant_id = props.tenant_id;
    this.date = props.date;
    this.place = props.place;
  }

  get date(): Date {
    return this.props.date;
  }

  private set date(value: Date) {
    this.props.date = value;
  }

  get tenant_id(): TenantId {
    return this.props.tenant_id;
  }

  private set tenant_id(value: TenantId) {
    this.props.tenant_id = value;
  }

  get place(): string | null {
    return this.props.place;
  }

  private set place(value: string | null) {
    this.props.place = value;
  }

  get home(): GameTeam {
    return this.props.home;
  }

  private set home(value: GameTeam) {
    this.props.home = value;
  }

  get away(): GameTeam {
    return this.props.away;
  }

  private set away(value: GameTeam) {
    this.props.away = value;
  }

  //   update(name: string) {
  //     Game.validate({ ...this.props, name });
  //     this.name = name;
  //   }

  static validate(props: GameProps) {
    const validator = GameValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON(): GamePropsJson {
    return {
      id: this.id.toString(),
      ...this.props,
      tenant_id: this.tenant_id.value,
      home: this.home.toJSON(),
      away: this.away.toJSON(),
    };
  }
}
