import { Entity } from "@/backend/@seedwork/domain/entities/entity";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { UniqueEntityId } from "@/backend/@seedwork/domain/value-objects/unique-entity-id.vo";
import { TeamValidatorFactory } from "../validators/team.validator";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";

export type TeamProps = {
  name: string;
  tenant_id: TenantId;
};

export type TeamPropsJson = Required<
  { id: string } & Omit<TeamProps, "tenant_id"> & { tenant_id: string }
>;

export class TeamId extends UniqueEntityId {}

export class Team extends Entity {
  constructor(public readonly props: TeamProps, entityId?: TeamId) {
    Team.validate(props);
    super(props, entityId ?? new TeamId());
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
    Team.validate({ ...this.props, name });
    this.name = name;
  }

  static validate(props: TeamProps) {
    const validator = TeamValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON(): TeamPropsJson {
    return {
      id: this.id.toString(),
      tenant_id: this.tenant_id.value,
      name: this.name,
    } as TeamPropsJson;
  }
}
