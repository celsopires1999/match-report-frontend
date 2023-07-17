import { Game, GameId, GameProps, GamePropsJson } from "./game";

export type AdditionalProps = {
  created_at: Date;
  updated_at: Date;
};

export type GameQueryProps = GameProps & AdditionalProps;

export type GameQueryPropsJson = GamePropsJson & AdditionalProps;

export class GameQuery extends Game {
  constructor(public readonly props: GameQueryProps, entityId?: GameId) {
    super(props, entityId);
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  get updated_at(): Date {
    return this.props.updated_at;
  }

  toJSON(): GameQueryPropsJson {
    return {
      ...super.toJSON(),
      created_at: this.created_at,
      updated_at: this.updated_at,
    } as GameQueryPropsJson;
  }
}
