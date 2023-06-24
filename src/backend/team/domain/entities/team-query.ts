import { Team, TeamId, TeamProps, TeamPropsJson } from "./team";

export type AdditionalProps = {
  created_at: Date;
  updated_at: Date;
};

export type TeamQueryProps = TeamProps & AdditionalProps;

export type TeamQueryPropsJson = TeamPropsJson & AdditionalProps;

export class TeamQuery extends Team {
  constructor(public readonly props: TeamQueryProps, entityId?: TeamId) {
    super(props, entityId);
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  get updated_at(): Date {
    return this.props.updated_at;
  }

  toJSON(): TeamQueryPropsJson {
    return {
      ...super.toJSON(),
      created_at: this.created_at,
      updated_at: this.updated_at,
    } as TeamQueryPropsJson;
  }
}
