import { ValueObject } from "@/backend/@seedwork/domain/value-objects/value-object";
import { InvalidGameTeamError } from "../errors/game-team.error";
import { GamePlayer, GamePlayerJson } from "./game-player.vo";

export type GameTeamProps = {
  id: string;
  name: string;
  gols: number;
  assists: number;
  players: GamePlayer[];
};

export type GameTeamJson = {
  id: string;
  name: string;
  gols: number;
  assists: number;
  players: GamePlayerJson[];
};

export class GameTeam extends ValueObject<GameTeamProps> {
  private constructor(value: GameTeamProps) {
    if (Array.isArray(value.players)) {
      const _value = { ...value };
      const filteredPlayers = new Map<string, GamePlayer>();
      _value.players.forEach((p) => filteredPlayers.set(p.value.id, p));
      _value.players = [];
      filteredPlayers.forEach((p) => _value.players.push(p));
      super(_value);
    } else {
      super(value);
    }

    this.validate();
  }

  static create(value: GameTeamProps): GameTeam {
    try {
      return new GameTeam(value);
    } catch (error) {
      throw error;
    }
  }

  static createFromJSON(value: GameTeamJson) {
    const { id, name, gols, assists, ...otherValues } = value;

    const players = otherValues.players.map((p) => GamePlayer.create(p));
    return new GameTeam({
      id,
      name,
      gols,
      assists,
      players,
    });
  }

  private validate() {
    if (
      typeof this.value.id !== "string" ||
      typeof this.value.name !== "string" ||
      typeof this.value.gols !== "number" ||
      typeof this.value.assists !== "number" ||
      !Array.isArray(this.value.players)
    ) {
      throw new InvalidGameTeamError(this.value);
    }

    if (
      this.value.id.length === 0 ||
      this.value.name.length < 3 ||
      this.value.players.length === 0
    ) {
      throw new InvalidGameTeamError(this.value);
    }
  }

  toJSON(): GameTeamJson {
    return {
      id: this.value.id,
      name: this.value.name,
      gols: this.value.gols,
      assists: this.value.assists,
      players: this.value.players.map((p) => p.toJSON()),
    };
  }
}
