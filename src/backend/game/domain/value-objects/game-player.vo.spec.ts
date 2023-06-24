import { InvalidGamePlayerError } from "../errors/game-player.error";
import { GamePlayer, GamePlayerProps } from "./game-player.vo";

describe("GamePlayer Unit Tests", () => {
  it("should create game player successfully", () => {
    const gamePlayerProps: GamePlayerProps = {
      id: "1",
      name: "Player One",
      gols: 2,
      assists: 3,
    };
    const gamePlayer = GamePlayer.create(gamePlayerProps);
    expect(gamePlayer.value).toEqual(gamePlayerProps);
  });

  it("should return an error when creating a game player with invalid value", () => {
    expect(() => GamePlayer.create(3 as unknown as GamePlayerProps)).toThrow(
      new InvalidGamePlayerError(3)
    );
  });
});
