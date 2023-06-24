import { Player, PlayerId, PlayerProps, PlayerPropsJson } from "./player";

export type AdditionalProps = {
  created_at: Date;
  updated_at: Date;
};

export type PlayerQueryProps = PlayerProps & AdditionalProps;

export type PlayerQueryPropsJson = PlayerPropsJson & AdditionalProps;

export class PlayerQuery extends Player {
  constructor(public readonly props: PlayerQueryProps, entityId?: PlayerId) {
    super(props, entityId);
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  get updated_at(): Date {
    return this.props.updated_at;
  }

  toJSON(): PlayerQueryPropsJson {
    return {
      ...super.toJSON(),
      created_at: this.created_at,
      updated_at: this.updated_at,
    } as PlayerQueryPropsJson;
  }
}
