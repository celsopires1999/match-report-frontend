import { InvalidGameTeamError } from "../errors/game-team.error";
import { GamePlayer } from "./game-player.vo";
import { GameTeam, GameTeamProps } from "./game-team.vo";

describe("GameTeam Unit Tests", () => {
  let gamePlayers: GamePlayer[];
  let gameTeamProps: GameTeamProps;

  beforeEach(() => {
    gamePlayers = [
      GamePlayer.create({
        id: "1",
        name: "Player One",
        gols: 2,
        assists: 3,
      }),
      GamePlayer.create({
        id: "2",
        name: "Player Two",
        gols: 3,
        assists: 2,
      }),
    ];

    gameTeamProps = {
      id: "1",
      name: "Team One",
      gols: 2,
      assists: 3,
      players: gamePlayers,
    };
  });

  it("should create successfully", () => {
    const gameTeam = GameTeam.create(gameTeamProps);
    expect(gameTeam.value).toEqual(gameTeamProps);
  });

  it("should throw an error with invalid value", () => {
    expect(() => GameTeam.create(3 as unknown as GameTeamProps)).toThrow(
      new InvalidGameTeamError(3)
    );
  });

  it("should throw an error with invalid id", () => {
    const gameTeamPropsError = { ...gameTeamProps };
    gameTeamPropsError.id = "";
    expect(() => GameTeam.create(gameTeamPropsError)).toThrow(
      new InvalidGameTeamError(gameTeamPropsError)
    );
  });

  it("should throw an error with invalid name", () => {
    const gameTeamPropsError = { ...gameTeamProps };
    gameTeamPropsError.name = "";
    expect(() => GameTeam.create(gameTeamPropsError)).toThrow(
      new InvalidGameTeamError(gameTeamPropsError)
    );
  });

  it("should throw an error with invalid gols", () => {
    const gameTeamPropsError = { ...gameTeamProps };
    gameTeamPropsError.gols = "fake-value" as any;
    expect(() => GameTeam.create(gameTeamPropsError)).toThrow(
      new InvalidGameTeamError(gameTeamPropsError)
    );
  });

  it("should throw an error with invalid assists", () => {
    const gameTeamPropsError = { ...gameTeamProps };
    gameTeamPropsError.assists = "fake-value" as any;
    expect(() => GameTeam.create(gameTeamPropsError)).toThrow(
      new InvalidGameTeamError(gameTeamPropsError)
    );
  });

  it("should throw an error with invalid players", () => {
    const gameTeamPropsError = { ...gameTeamProps };
    gameTeamPropsError.players = [];
    expect(() => GameTeam.create(gameTeamPropsError)).toThrow(
      new InvalidGameTeamError(gameTeamPropsError)
    );
  });
});
