import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { GamePlayer } from "../value-objects/game-player.vo";
import { GameTeam } from "../value-objects/game-team.vo";
import { Game, GameId, GameProps, GamePropsJson } from "./game";

describe("Game Unit Test", () => {
  const gamePlayersHome = [
    GamePlayer.create({
      id: "1",
      name: "Player Home One",
      gols: 2,
      assists: 3,
    }),
    GamePlayer.create({
      id: "2",
      name: "Player Home Two",
      gols: 3,
      assists: 2,
    }),
  ];

  const gameTeamHome = GameTeam.create({
    id: "1",
    name: "Team Home",
    gols: 2,
    assists: 3,
    players: gamePlayersHome,
  });

  const gamePlayersAway = [
    GamePlayer.create({
      id: "3",
      name: "Player Away One",
      gols: 2,
      assists: 3,
    }),
    GamePlayer.create({
      id: "4",
      name: "Player Away Two",
      gols: 3,
      assists: 2,
    }),
  ];

  const gameTeamAway = GameTeam.create({
    id: "2",
    name: "Team Away",
    gols: 2,
    assists: 3,
    players: gamePlayersAway,
  });

  const tester = {
    props: {
      tenant_id: new TenantId(),
      date: new Date(),
      place: "Place of Game",
      home: gameTeamHome,
      away: gameTeamAway,
    } as GameProps,
  };

  beforeEach(() => {
    Game.validate = jest.fn();
  });
  test("constructor of Game", () => {
    let game = new Game(tester.props);
    let props = game.props;
    expect(Game.validate).toHaveBeenCalled();
    expect(props).toStrictEqual(tester.props);
  });

  describe("id prop", () => {
    const props: GameProps = tester.props;

    const arrange = [
      { props },
      { props, id: null as any },
      { props, id: undefined },
      { props, id: new GameId() },
    ];
    test.each(arrange)("%#) when props are %j", (item) => {
      const game = new Game(item.props, item.id as any);
      expect(game.id).not.toBeNull();
      expect(game.entityId).toBeInstanceOf(GameId);
    });
  });

  test("getter and setter of tenant prop", () => {
    const game = new Game(tester.props);
    const tenant_id = new TenantId();
    game["tenant_id"] = tenant_id;
    expect(game.tenant_id).toEqual(tenant_id);
  });

  test("getter and setter of date prop", () => {
    const game = new Game(tester.props);
    const date: Date = new Date();
    game["date"] = date;
    expect(game.date).toEqual(date);
  });

  test("getter and setter of place prop", () => {
    const game = new Game(tester.props);
    const place = "new place";
    game["place"] = place;
    expect(game.place).toEqual(place);
  });

  test("getter and setter of home prop", () => {
    const game = new Game(tester.props);
    const players = [
      GamePlayer.create({
        id: "222",
        name: "Player 222",
        assists: 22,
        gols: 22,
      }),
    ];

    const team = GameTeam.create({
      id: "22",
      name: "Team 22",
      assists: 22,
      gols: 22,
      players,
    });

    game["home"] = team;
    expect(game.home).toEqual(team);
  });

  test("getter and setter of away prop", () => {
    const game = new Game(tester.props);
    const players = [
      GamePlayer.create({
        id: "222",
        name: "Player 222",
        assists: 22,
        gols: 22,
      }),
    ];

    const team = GameTeam.create({
      id: "22",
      name: "Team 22",
      assists: 22,
      gols: 22,
      players,
    });

    game["away"] = team;
    expect(game.away).toEqual(team);
  });

  //   it("should update a game", () => {
  //     const game = new Game(tester.props);

  //     game.update("Game 2");
  //     expect(Game.validate).toHaveBeenCalledTimes(2);
  //     expect(game.name).toBe("Game 2");
  //     expect(game.props).toStrictEqual({
  //       ...tester.props,
  //       name: "Game 2",
  //     });
  //   });

  it("should converte to JSON", () => {
    const game = new Game(tester.props);

    const expected: GamePropsJson = {
      id: game.id,
      date: game.date,
      place: game.place,
      tenant_id: game.tenant_id.value,
      home: game.home.toJSON(),
      away: game.away.toJSON(),
    };
    expect(game.toJSON()).toStrictEqual(expected);
  });
});
