import { Entity } from "@/backend/@seedwork/domain/entities/entity";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { UniqueEntityId } from "@/backend/@seedwork/domain/value-objects/unique-entity-id.vo";
import { TenantValidatorFactory } from "../validators/tenant.validator";

export type TenantProps = {
  name: string
}

export type TenantPropsJson = Required<{ id: string } & TenantProps>;

export class TenantId extends UniqueEntityId { }

export class Tenant extends Entity {

  constructor(public readonly props: TenantProps, entityId?: TenantId) {
    Tenant.validate(props);
    super(props, entityId ?? new TenantId());
    this.name = props.name
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  update(name: string) {
    Tenant.validate({ ...this.props, name });
    this.name = name;
  }

  static validate(props: TenantProps) {
    const validator = TenantValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON(): TenantPropsJson {
    return {
      id: this.id.toString(),
      ...this.props,
    } as TenantPropsJson;
  }
}
