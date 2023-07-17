import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { Game, GameId, GameProps } from "@/backend/game/domain/entities/game";
import { GamePlayer } from "@/backend/game/domain/value-objects/game-player.vo";
import { GameTeam } from "@/backend/game/domain/value-objects/game-team.vo";
import { Tenant, TenantId } from "@/backend/tenant/domain/entities/tenant";
import { GamePrisma } from "./game-prisma";

describe("Game Integration Test", () => {
  let tenant: Tenant;
  let entity: Game;
  let repository: GamePrisma.Repository;
  beforeEach(async () => {
    repository = new GamePrisma.Repository();
    await initializePrisma();

    tenant = new Tenant({ name: "League One" });
    entity = new Game(aGameProps(tenant));
  });

  it("should create a game", async () => {
    await repository.insert(entity);
    const createdGame = await repository.findById(tenant.entityId, entity.id);
    expect(createdGame.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error on creating when a game exists already", async () => {
    await repository.insert(entity);
    expect(repository.insert(entity)).rejects.toThrow(
      new DuplicatedError(`Entity duplicated with ID ${entity.id}`)
    );
  });

  // it("should update a game", async () => {
  //   await repository.insert(entity);

  //   entity.update("Liga Two");
  //   await repository.update(entity);

  //   let entityFound = await repository.findById(entity.id);
  //   expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  // });

  // it("should throw an error on updating when game is not found", async () => {
  //   expect(repository.update(entity)).rejects.toThrow(
  //     new NotFoundError(`Entity not found using ID ${entity.id}`)
  //   );
  // });

  it("should delete a game", async () => {
    await repository.insert(entity);
    await repository.delete(tenant.entityId, entity.id);
    expect(repository.findById(tenant.entityId, entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should throw an error on deleting when game is not found", async () => {
    expect(repository.delete(tenant.entityId, entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should find a game by id", async () => {
    await repository.insert(entity);
    const createdGame = await repository.findById(tenant.entityId, entity.id);
    expect(createdGame.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error when game is not found", async () => {
    expect(repository.findById(tenant.entityId, "fake-id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake-id`)
    );
  });

  // it("should find a game by name", async () => {
  //   await repository.insert(entity);
  //   const createdGame = await repository.findByName(entity.name, tenant.id);
  //   expect(createdGame.toJSON()).toEqual(entity.toJSON());
  // });

  // it("should throw an error when game is not found by name", async () => {
  //   expect(repository.findByName("fake-name", tenant.id)).rejects.toThrow(
  //     new NotFoundError(`Entity not found using Name fake-name`)
  //   );
  // });

  // it("should insert a game in another tenant", async () => {
  //   await repository.insert(entity);

  //   const anotherTenant = new Tenant({ name: "Another Tenant" });
  //   const tenantRepository = new TenantPrisma.Repository();
  //   await tenantRepository.insert(anotherTenant);

  //   const gameInAnotherTenant = new Game({
  //     name: entity.name,
  //     tenant_id: anotherTenant.entityId,
  //   });

  //   await repository.insert(gameInAnotherTenant);

  //   const createdGame = await repository.findByName(
  //     entity.name,
  //     anotherTenant.entityId
  //   );
  //   expect(createdGame.toJSON()).toEqual(gameInAnotherTenant.toJSON());
  // });

  it("should find all games", async () => {
    const games = theGames(tenant.entityId);
    await repository.bulkInsert(games);
    const foundGames = await repository.findAll(tenant.id);
    expect(JSON.stringify(foundGames)).toEqual(JSON.stringify(games));
  });

  it("should list all games", async () => {
    const games = theGames(tenant.entityId);
    await repository.bulkInsert(games);
    const foundGames = await repository.listAll(tenant.id);

    for (let n = 0; n > games.length; n++) {
      expect(foundGames[n].id).toBe(games[n].id);
      expect(foundGames[n].place).toBe(games[n].place);
      expect(foundGames[n].date).toEqual(games[n].date);
      expect(foundGames[n].home.toJSON()).toEqual(games[n].home.toJSON());
      expect(foundGames[n].away.toJSON()).toEqual(games[n].away.toJSON());
      expect(foundGames[n].created_at).toBeInstanceOf(Date);
      expect(foundGames[n].updated_at).toBeInstanceOf(Date);
    }
  });
});

function aGameProps(tenant: Tenant): GameProps {
  const tenant_id = tenant.entityId;
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

  return gameProps;
}

function theGames(tenant_id: TenantId): Game[] {
  return [
    new Game(
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
    ),
    new Game(
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
      new GameId("92e73155-acc7-4ca6-961c-ad5e00a2e701")
    ),
  ];
}
