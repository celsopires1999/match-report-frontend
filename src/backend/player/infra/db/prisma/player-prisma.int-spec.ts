import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { Player } from "@/backend/player/domain/entities/player";
import { Tenant, TenantId } from "@/backend/tenant/domain/entities/tenant";
import { TenantPrisma } from "@/backend/tenant/infra/db/prisma/tenant-prisma";
import { PlayerPrisma } from "./player-prisma";

describe("Player Integration Test", () => {
  let tenant: Tenant;
  let entity: Player;
  let repository: PlayerPrisma.Repository;
  beforeEach(async () => {
    repository = new PlayerPrisma.Repository();
    await initializePrisma();

    tenant = new Tenant({ name: "League One" });
    const tenantRepository = new TenantPrisma.Repository();
    await tenantRepository.insert(tenant);

    entity = new Player({
      name: "Player One",
      tenant_id: new TenantId(tenant.id),
    });
  });

  it("should create a player", async () => {
    await repository.insert(entity);
    const createdPlayer = await repository.findById(entity.id);
    expect(createdPlayer.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error on creating when a player exists already", async () => {
    await repository.insert(entity);
    expect(repository.insert(entity)).rejects.toThrow(
      new DuplicatedError(`Entity duplicated with ID ${entity.id}`)
    );
  });

  it("should update a player", async () => {
    await repository.insert(entity);

    entity.update("Liga Two");
    await repository.update(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should throw an error on updating when player is not found", async () => {
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should delete a player", async () => {
    await repository.insert(entity);
    await repository.delete(entity.id);
    expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should throw an error on deleting when player is not found", async () => {
    expect(repository.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should find a player by id", async () => {
    await repository.insert(entity);
    const createdPlayer = await repository.findById(entity.id);
    expect(createdPlayer.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error when player is not found", async () => {
    expect(repository.findById("fake-id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake-id`)
    );
  });

  it("should find a player by name", async () => {
    await repository.insert(entity);
    const createdPlayer = await repository.findByName(entity.name, tenant.id);
    expect(createdPlayer.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error when player is not found by name", async () => {
    expect(repository.findByName("fake-name", tenant.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using Name fake-name`)
    );
  });

  it("should insert a player in another tenant", async () => {
    await repository.insert(entity);

    const anotherTenant = new Tenant({ name: "Another Tenant" });
    const tenantRepository = new TenantPrisma.Repository();
    await tenantRepository.insert(anotherTenant);

    const playerInAnotherTenant = new Player({
      name: entity.name,
      tenant_id: anotherTenant.entityId,
    });

    await repository.insert(playerInAnotherTenant);

    const createdPlayer = await repository.findByName(
      entity.name,
      anotherTenant.entityId
    );
    expect(createdPlayer.toJSON()).toEqual(playerInAnotherTenant.toJSON());
  });

  it("should find all players", async () => {
    const players = [
      new Player({ name: "Liga One", tenant_id: new TenantId(tenant.id) }),
      new Player({ name: "Liga Two", tenant_id: new TenantId(tenant.id) }),
    ];
    await repository.bulkInsert(players);
    const foundPlayers = await repository.findAll(tenant.id);
    expect(JSON.stringify(foundPlayers)).toEqual(JSON.stringify(players));
  });

  it("should list all players", async () => {
    const players = [
      new Player({ name: "Liga One", tenant_id: new TenantId(tenant.id) }),
      new Player({ name: "Liga Two", tenant_id: new TenantId(tenant.id) }),
    ];
    await repository.bulkInsert(players);
    const foundPlayers = await repository.listAll(tenant.id);

    for (let n = 0; n > players.length; n++) {
      expect(foundPlayers[n].id).toBe(players[n].id);
      expect(foundPlayers[n].name).toBe(players[n].name);
      expect(foundPlayers[n].created_at).toBeInstanceOf(Date);
      expect(foundPlayers[n].updated_at).toBeInstanceOf(Date);
    }
  });
});
