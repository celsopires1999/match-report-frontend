import { Entity } from "@/backend/@seedwork/domain/entities/entity";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { UniqueEntityId } from "@/backend/@seedwork/domain/value-objects/unique-entity-id.vo";
import { PlayerValidatorFactory } from "../validators/player.validator";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";

export type PlayerProps = {
  name: string;
  tenant_id: TenantId;
};

export type PlayerPropsJson = Required<
  { id: string } & Omit<PlayerProps, "tenant_id"> & { tenant_id: string }
>;

export class PlayerId extends UniqueEntityId {}

export class Player extends Entity {
  constructor(public readonly props: PlayerProps, entityId?: PlayerId) {
    Player.validate(props);
    super(props, entityId ?? new PlayerId());
    this.name = props.name;
    this.tenant_id = props.tenant_id;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get tenant_id(): TenantId {
    return this.props.tenant_id;
  }

  private set tenant_id(value: TenantId) {
    this.props.tenant_id = value;
  }

  update(name: string) {
    Player.validate({ ...this.props, name });
    this.name = name;
  }

  static validate(props: PlayerProps) {
    const validator = PlayerValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON(): PlayerPropsJson {
    return {
      id: this.id.toString(),
      tenant_id: this.tenant_id.value,
      name: this.name,
    } as PlayerPropsJson;
  }
}
