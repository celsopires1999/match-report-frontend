import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { Game, GameId, GameProps } from "./game";
import { UniqueEntityId } from "@/backend/@seedwork/domain/value-objects/unique-entity-id.vo";
import { GamePlayer } from "../value-objects/game-player.vo";
import { GameTeam } from "../value-objects/game-team.vo";

describe("Game Integration Tests", () => {
  describe("constructor", () => {
    it("should throw an error when tenant is invalid ", () => {
      expect(() => new Game({ tenant: null } as any)).containsErrorMessages({
        tenant_id: [
          "tenant_id should not be empty",
          "tenant_id must be a non-empty object",
        ],
      });

      expect(() => new Game({ tenant: "" } as any)).containsErrorMessages({
        tenant_id: [
          "tenant_id should not be empty",
          "tenant_id must be a non-empty object",
        ],
      });

      expect(() => new Game({ tenant: 5 as any } as any)).containsErrorMessages(
        {
          tenant_id: [
            "tenant_id should not be empty",
            "tenant_id must be a non-empty object",
          ],
        }
      );
    });

    it("should throw an error when date is invalid ", () => {
      expect(
        () => new Game({ date: "fake-date" } as any)
      ).containsErrorMessages({
        date: ["date must be a Date instance"],
      });

      expect(() => new Game({ date: 5 } as any)).containsErrorMessages({
        date: ["date must be a Date instance"],
      });

      expect(() => new Game({ date: true } as any)).containsErrorMessages({
        date: ["date must be a Date instance"],
      });
    });

    it("should throw an error when place is invalid ", () => {
      expect(() => new Game({ place: 5 as any } as any)).containsErrorMessages({
        place: [
          "place must be a string",
          "place must be shorter than or equal to 255 characters",
          "place must be longer than or equal to 3 characters",
        ],
      });

      expect(
        () => new Game({ place: "ab" as any } as any)
      ).containsErrorMessages({
        place: ["place must be longer than or equal to 3 characters"],
      });

      expect(
        () => new Game({ place: "t".repeat(256) } as any)
      ).containsErrorMessages({
        place: ["place must be shorter than or equal to 255 characters"],
      });
    });

    it("should throw an error when home is invalid ", () => {
      expect(() => new Game({ home: null } as any)).containsErrorMessages({
        home: ["home should not be empty", "home must be a non-empty object"],
      });

      expect(() => new Game({ home: "" } as any)).containsErrorMessages({
        home: ["home should not be empty", "home must be a non-empty object"],
      });

      expect(() => new Game({ home: 5 as any } as any)).containsErrorMessages({
        home: ["home must be a non-empty object"],
      });
    });

    it("should throw an error when away is invalid ", () => {
      expect(() => new Game({ away: null } as any)).containsErrorMessages({
        away: ["away should not be empty", "away must be a non-empty object"],
      });

      expect(() => new Game({ away: "" } as any)).containsErrorMessages({
        away: ["away should not be empty", "away must be a non-empty object"],
      });

      expect(() => new Game({ away: 5 as any } as any)).containsErrorMessages({
        away: ["away must be a non-empty object"],
      });
    });

    it("should create a Game", () => {
      const tenant_id = new TenantId();

      const date = new Date();
      const place = "Place of the Game";
      const playerEleven = GamePlayer.create({
        id: "11",
        name: "Player 11",
        assists: 2,
        gols: 3,
      });
      const playerTwelve = GamePlayer.create({
        id: "12",
        name: "Player 12",
        assists: 3,
        gols: 2,
      });

      const playerThirteen = GamePlayer.create({
        id: "13",
        name: "Player 13",
        assists: 3,
        gols: 2,
      });
      const playerFourteen = GamePlayer.create({
        id: "14",
        name: "Player 14",
        assists: 2,
        gols: 3,
      });

      const home = GameTeam.create({
        id: "111",
        name: "Team 111",
        assists: 1,
        gols: 2,
        players: [playerEleven, playerTwelve],
      });

      const away = GameTeam.create({
        id: "222",
        name: "Team 222",
        assists: 1,
        gols: 2,
        players: [playerThirteen, playerFourteen],
      });

      const gameProps: GameProps = {
        tenant_id,
        place,
        date,
        home,
        away,
      };

      const game = new Game(gameProps);

      expect(game.entityId).toBeInstanceOf(UniqueEntityId);
      expect(game.tenant_id).toEqual(tenant_id);
      expect(game.date).toEqual(date);
      expect(game.place).toEqual(place);
      expect(game.home).toEqual(home);
      expect(game.away).toEqual(away);
    });
  });

  describe("updateGol method", () => {
    it("should update gols and assists", () => {
      const tenant_id = new TenantId();
      const game = new Game(
        {
          tenant_id,
          date: new Date(),
          place: "Place of the Game",
          home: GameTeam.createFromJSON({
            id: "111",
            name: "Team 111",
            gols: 2,
            assists: 1,
            players: [
              { id: "11", name: "Player 11", gols: 3, assists: 2 },
              { id: "12", name: "Player 12", gols: 2, assists: 3 },
            ],
          }),
          away: GameTeam.createFromJSON({
            id: "222",
            name: "Team 222",
            gols: 2,
            assists: 1,
            players: [
              { id: "13", name: "Player 13", gols: 2, assists: 3 },
              { id: "14", name: "Player 14", gols: 3, assists: 2 },
            ],
          }),
        },
        new GameId("5ed7b2de-2a7d-4d10-9ee3-17e335a4e1c8")
      );

      game.updateGol("111", "12", "11");
      expect(game.home.value.gols).toBe(3);
      expect(game.home.value.assists).toBe(2);
      expect(game.home.value.players[0].value.gols).toBe(3);
      expect(game.home.value.players[0].value.assists).toBe(3);
      expect(game.home.value.players[1].value.gols).toBe(3);
      expect(game.home.value.players[1].value.assists).toBe(3);

      game.updateGol("222", "13", "14");
      expect(game.away.value.gols).toBe(3);
      expect(game.away.value.assists).toBe(2);
      expect(game.away.value.players[0].value.gols).toBe(3);
      expect(game.away.value.players[0].value.assists).toBe(3);
      expect(game.away.value.players[1].value.gols).toBe(3);
      expect(game.away.value.players[1].value.assists).toBe(3);
    });
  });

  //   describe("update method", () => {
  //     it("should throw an error when name is invalid", () => {
  //       const game = new Game({
  //         name: "Game 1",
  //         tenant_id: new TenantId(),
  //       });
  //       expect(() => game.update(null as any)).containsErrorMessages({
  //         name: [
  //           "name should not be empty",
  //           "name must be a string",
  //           "name must be shorter than or equal to 255 characters",
  //           "name must be longer than or equal to 3 characters",
  //         ],
  //       });

  //       expect(() => game.update("")).containsErrorMessages({
  //         name: [
  //           "name should not be empty",
  //           "name must be longer than or equal to 3 characters",
  //         ],
  //       });

  //       expect(() => game.update(5 as any)).containsErrorMessages({
  //         name: [
  //           "name must be a string",
  //           "name must be shorter than or equal to 255 characters",
  //           "name must be longer than or equal to 3 characters",
  //         ],
  //       });

  //       expect(() => game.update("t".repeat(256))).containsErrorMessages({
  //         name: ["name must be shorter than or equal to 255 characters"],
  //       });
  //     });

  //     it("should update a tenant with valid properties", () => {
  //       expect.assertions(0);
  //       const game = new Game({
  //         name: "Game 1",
  //         tenant_id: new TenantId(),
  //       });
  //       game.update("Game 2");
  //     });
  //   });
});
