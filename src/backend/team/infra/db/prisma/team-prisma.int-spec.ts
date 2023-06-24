import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { Team } from "@/backend/team/domain/entities/team";
import { Tenant, TenantId } from "@/backend/tenant/domain/entities/tenant";
import { TenantPrisma } from "@/backend/tenant/infra/db/prisma/tenant-prisma";
import { TeamPrisma } from "./team-prisma";

describe("Team Integration Test", () => {
  let tenant: Tenant;
  let entity: Team;
  let repository: TeamPrisma.Repository;
  beforeEach(async () => {
    repository = new TeamPrisma.Repository();
    await initializePrisma();

    tenant = new Tenant({ name: "League One" });
    const tenantRepository = new TenantPrisma.Repository();
    await tenantRepository.insert(tenant);

    entity = new Team({
      name: "Team One",
      tenant_id: tenant.entityId,
    });
  });

  it("should create a team", async () => {
    await repository.insert(entity);
    const createdTeam = await repository.findById(entity.id);
    expect(createdTeam.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error on creating when a team exists already", async () => {
    await repository.insert(entity);
    expect(repository.insert(entity)).rejects.toThrow(
      new DuplicatedError(`Entity duplicated with ID ${entity.id}`)
    );
  });

  it("should update a team", async () => {
    await repository.insert(entity);

    entity.update("Liga Two");
    await repository.update(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should throw an error on updating when team is not found", async () => {
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should delete a team", async () => {
    await repository.insert(entity);
    await repository.delete(entity.id);
    expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should throw an error on deleting when team is not found", async () => {
    expect(repository.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should find a team by id", async () => {
    await repository.insert(entity);
    const createdTeam = await repository.findById(entity.id);
    expect(createdTeam.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error when team is not found", async () => {
    expect(repository.findById("fake-id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake-id`)
    );
  });

  it("should find a team by name", async () => {
    await repository.insert(entity);
    const createdTeam = await repository.findByName(entity.name, tenant.id);
    expect(createdTeam.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error when team is not found by name", async () => {
    expect(repository.findByName("fake-name", tenant.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using Name fake-name`)
    );
  });

  it("should insert a team in another tenant", async () => {
    await repository.insert(entity);

    const anotherTenant = new Tenant({ name: "Another Tenant" });
    const tenantRepository = new TenantPrisma.Repository();
    await tenantRepository.insert(anotherTenant);

    const teamInAnotherTenant = new Team({
      name: entity.name,
      tenant_id: anotherTenant.entityId,
    });

    await repository.insert(teamInAnotherTenant);

    const createdTeam = await repository.findByName(
      entity.name,
      anotherTenant.entityId
    );
    expect(createdTeam.toJSON()).toEqual(teamInAnotherTenant.toJSON());
  });

  it("should find all teams", async () => {
    const teams = [
      new Team({ name: "Liga One", tenant_id: tenant.entityId }),
      new Team({ name: "Liga Two", tenant_id: tenant.entityId }),
    ];
    await repository.bulkInsert(teams);
    const foundTeams = await repository.findAll(tenant.id);
    expect(JSON.stringify(foundTeams)).toEqual(JSON.stringify(teams));
  });

  it("should list all teams", async () => {
    const teams = [
      new Team({ name: "Liga One", tenant_id: new TenantId(tenant.id) }),
      new Team({ name: "Liga Two", tenant_id: new TenantId(tenant.id) }),
    ];
    await repository.bulkInsert(teams);
    const foundTeams = await repository.listAll(tenant.id);

    for (let n = 0; n < teams.length; n++) {
      expect(foundTeams[n].id).toBe(teams[n].id);
      expect(foundTeams[n].name).toBe(teams[n].name);
      expect(foundTeams[n].created_at).toBeInstanceOf(Date);
      expect(foundTeams[n].updated_at).toBeInstanceOf(Date);
    }
  });
});
