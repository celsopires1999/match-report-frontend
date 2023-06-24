import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { Player } from "@/backend/player/domain/entities/player";
import { PlayerPrisma } from "@/backend/player/infra/db/prisma/player-prisma";
import { TeamPlayer } from "@/backend/team-player/domain/entities/team-player";
import { Team } from "@/backend/team/domain/entities/team";
import { TeamPrisma } from "@/backend/team/infra/db/prisma/team-prisma";
import { Tenant } from "@/backend/tenant/domain/entities/tenant";
import { TenantPrisma } from "@/backend/tenant/infra/db/prisma/tenant-prisma";
import { TeamPlayerPrisma } from "./team-player-prisma";

describe("TeamPlayer Integration Test", () => {
  let tenant: Tenant;
  let team: Team;
  let player: Player;
  let entity: TeamPlayer;
  let repository: TeamPlayerPrisma.Repository;
  beforeEach(async () => {
    repository = new TeamPlayerPrisma.Repository();
    await initializePrisma();

    tenant = new Tenant({ name: "League One" });
    const tenantRepository = new TenantPrisma.Repository();
    await tenantRepository.insert(tenant);

    team = new Team({ name: "Team One", tenant_id: tenant.entityId });
    const teamRepository = new TeamPrisma.Repository();
    await teamRepository.insert(team);

    player = new Player({ name: "Player One", tenant_id: tenant.entityId });
    await savePlayer(player);

    entity = new TeamPlayer({
      tenant_id: tenant.entityId,
      team_id: team.entityId,
      player_id: player.entityId,
    });
  });

  test("struct validation", async () => {
    expect.assertions(0);
  });

  it("should create a team-player", async () => {
    await repository.insert(entity);
    const createdTeamPlayer = await repository.findById(entity.id);
    expect(createdTeamPlayer.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error on creating when a team-player exists already", async () => {
    await repository.insert(entity);
    expect(repository.insert(entity)).rejects.toThrow(
      new DuplicatedError(`Entity duplicated with ID ${entity.id}`)
    );
  });

  it("should delete a team-player", async () => {
    await repository.insert(entity);
    await repository.delete(entity.id);
    expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should throw an error on deleting when team-player is not found", async () => {
    expect(repository.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should find a team-player by id", async () => {
    await repository.insert(entity);
    const createdTeamPlayer = await repository.findById(entity.id);
    expect(createdTeamPlayer.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error when team-player is not found", async () => {
    expect(repository.findById("fake-id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake-id`)
    );
  });

  it("should throw an error when team-player exists already", async () => {
    await repository.insert(entity);

    const newEntity = new TeamPlayer({
      tenant_id: tenant.entityId,
      team_id: team.entityId,
      player_id: player.entityId,
    });

    expect(repository.insert(newEntity)).rejects.toThrow(
      new DuplicatedError(`Entity duplicated with ID ${newEntity.id}`)
    );
  });

  it("should insert a team-player in another tenant", async () => {
    await repository.insert(entity);

    const newTenant = new Tenant({ name: "Another Tenant" });

    const newEntity = new TeamPlayer({
      tenant_id: newTenant.entityId,
      team_id: team.entityId,
      player_id: player.entityId,
    });

    await repository.insert(newEntity);
    const createdTeamPlayer = await repository.findById(newEntity.id);
    expect(createdTeamPlayer.toJSON()).toEqual(newEntity.toJSON());
  });

  it("should find all team-players", async () => {
    const secondPlayer = new Player({
      name: "Player Two",
      tenant_id: tenant.entityId,
    });
    savePlayer(secondPlayer);

    const teamsPlayers = [
      new TeamPlayer({
        tenant_id: tenant.entityId,
        team_id: team.entityId,
        player_id: player.entityId,
      }),
      new TeamPlayer({
        tenant_id: tenant.entityId,
        team_id: team.entityId,
        player_id: secondPlayer.entityId,
      }),
    ];
    await repository.bulkInsert(teamsPlayers);
    const foundTeamsPlayers = await repository.findAll(tenant.id);
    const sortedFoundTeamsPlayers = foundTeamsPlayers.sort((a, b) =>
      a.id.toLocaleLowerCase().localeCompare(b.id.toLocaleLowerCase())
    );
    const sortedTeamsPlayers = teamsPlayers.sort((a, b) =>
      a.id.toLocaleLowerCase().localeCompare(b.id.toLocaleLowerCase())
    );
    expect(JSON.stringify(sortedFoundTeamsPlayers)).toEqual(
      JSON.stringify(sortedTeamsPlayers)
    );
  });

  it("should list all team-players", async () => {
    const secondPlayer = new Player({
      name: "Player Two",
      tenant_id: tenant.entityId,
    });
    savePlayer(secondPlayer);

    const teamsPlayers = [
      new TeamPlayer({
        tenant_id: tenant.entityId,
        team_id: team.entityId,
        player_id: player.entityId,
      }),
      new TeamPlayer({
        tenant_id: tenant.entityId,
        team_id: team.entityId,
        player_id: secondPlayer.entityId,
      }),
    ];
    await repository.bulkInsert(teamsPlayers);
    const foundTeamsPlayers = await repository.listAll(tenant.id);
    const sortedFoundTeamsPlayers = foundTeamsPlayers.sort((a, b) =>
      a.id.toLocaleLowerCase().localeCompare(b.id.toLocaleLowerCase())
    );
    const sortedTeamsPlayers = teamsPlayers.sort((a, b) =>
      a.id.toLocaleLowerCase().localeCompare(b.id.toLocaleLowerCase())
    );

    for (let n = 0; n < sortedFoundTeamsPlayers.length; n++) {
      expect(sortedFoundTeamsPlayers[n].id).toBe(sortedTeamsPlayers[n].id);
      expect({
        id: sortedFoundTeamsPlayers[n].entityId.value,
        tenant_id: sortedFoundTeamsPlayers[n].tenant_id.value,
        team_id: sortedFoundTeamsPlayers[n].team_id.value,
        player_id: sortedFoundTeamsPlayers[n].player_id.value,
      }).toEqual({
        id: sortedTeamsPlayers[n].entityId.value,
        tenant_id: sortedTeamsPlayers[n].tenant_id.value,
        team_id: sortedTeamsPlayers[n].team_id.value,
        player_id: sortedTeamsPlayers[n].player_id.value,
      });
      expect(sortedFoundTeamsPlayers[n].created_at).toBeInstanceOf(Date);
      expect(sortedFoundTeamsPlayers[n].updated_at).toBeInstanceOf(Date);
    }
  });
});

async function savePlayer(entity: Player) {
  const repository = new PlayerPrisma.Repository();
  await repository.insert(entity);
}
