import {
  PlayerQuery,
  PlayerQueryPropsJson,
} from "@/backend/player/domain/entities/player-query";
import {
  TeamQuery,
  TeamQueryPropsJson,
} from "@/backend/team/domain/entities/team-query";
import {
  TeamPlayer,
  TeamPlayerId,
  TeamPlayerProps,
  TeamPlayerPropsJson,
} from "./team-player";

export type AdditionalProps = {
  team: TeamQuery;
  player: PlayerQuery;
  created_at: Date;
  updated_at: Date;
};

export type TeamPlayerQueryProps = TeamPlayerProps & AdditionalProps;

export type TeamPlayerQueryPropsJson = TeamPlayerPropsJson &
  Omit<AdditionalProps, "team" | "player"> & { team: TeamQueryPropsJson } & {
    player: PlayerQueryPropsJson;
  };

export class TeamPlayerQuery extends TeamPlayer {
  constructor(
    public readonly props: TeamPlayerQueryProps,
    entityId?: TeamPlayerId
  ) {
    super(props, entityId);
  }

  get team(): TeamQuery {
    return this.props.team;
  }

  get player(): PlayerQuery {
    return this.props.player;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  get updated_at(): Date {
    return this.props.updated_at;
  }

  toJSON(): TeamPlayerQueryPropsJson {
    return {
      ...super.toJSON(),
      team: this.team.toJSON(),
      player: this.player.toJSON(),
      created_at: this.created_at,
      updated_at: this.updated_at,
    } as TeamPlayerQueryPropsJson;
  }
}
