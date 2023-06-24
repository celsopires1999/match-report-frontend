import { ValueObject } from "@/backend/@seedwork/domain/value-objects/value-object";
import { InvalidGamePlayerError } from "../errors/game-player.error";

export type GamePlayerProps = {
  id: string;
  name: string;
  gols: number;
  assists: number;
};

export type GamePlayerJson = {
  id: string;
  name: string;
  gols: number;
  assists: number;
};

export class GamePlayer extends ValueObject<GamePlayerProps> {
  private constructor(value: GamePlayerProps) {
    super(value);
    this.validate();
  }

  static create(value: GamePlayerProps): GamePlayer {
    try {
      return new GamePlayer(value);
    } catch (error) {
      throw error;
    }
  }

  private validate() {
    if (
      typeof this.value.id !== "string" ||
      typeof this.value.name !== "string" ||
      typeof this.value.gols !== "number" ||
      typeof this.value.assists !== "number"
    ) {
      throw new InvalidGamePlayerError(this.value);
    }

    if (this.value.id.length === 0 || this.value.name.length < 3) {
      throw new InvalidGamePlayerError(this.value);
    }
  }

  toJSON(): GamePlayerJson {
    return {
      id: this.value.id,
      name: this.value.name,
      gols: this.value.gols,
      assists: this.value.assists,
    };
  }
}
