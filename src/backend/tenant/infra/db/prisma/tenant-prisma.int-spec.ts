import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { initializePrisma } from "@/backend/@seedwork/tests/initialize-prisma";
import { Tenant } from "@/backend/tenant/domain/entities/tenant";
import { TenantPrisma } from "./tenant-prisma";

describe("Tenant Integration Test", () => {
  let repository: TenantPrisma.Repository;
  beforeEach(async () => {
    repository = new TenantPrisma.Repository();
    await initializePrisma();
  });

  it("should create a tenant", async () => {
    const entity = new Tenant({ name: "Liga One" });
    await repository.insert(entity);
    const createdTenant = await repository.findById(entity.id);
    expect(createdTenant.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error on creating when a tenant exists already", async () => {
    const entity = new Tenant({ name: "Liga One" });
    await repository.insert(entity);
    expect(repository.insert(entity)).rejects.toThrow(
      new DuplicatedError(`Entity duplicated with ID ${entity.id}`)
    );
  });

  it("should update a tenant", async () => {
    const entity = new Tenant({ name: "Liga One" });
    await repository.insert(entity);

    entity.update("Liga Two");
    await repository.update(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should throw an error on updating when tenant is not found", async () => {
    const entity = new Tenant({ name: "Liga One" });
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should delete a tenant", async () => {
    const entity = new Tenant({ name: "Liga One" });
    await repository.insert(entity);
    await repository.delete(entity.id);
    expect(repository.findById(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should throw an error on deleting when tenant is not found", async () => {
    const entity = new Tenant({ name: "Liga One" });

    expect(repository.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`Entity not found using ID ${entity.id}`)
    );
  });

  it("should find a tenant by id", async () => {
    const entity = new Tenant({ name: "Liga One" });
    await repository.insert(entity);
    const createdTenant = await repository.findById(entity.id);
    expect(createdTenant.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error when tenant is not found", async () => {
    expect(repository.findById("fake-id")).rejects.toThrow(
      new NotFoundError(`Entity not found using ID fake-id`)
    );
  });

  it("should find a tenant by name", async () => {
    const entity = new Tenant({ name: "Liga One" });
    await repository.insert(entity);
    const createdTenant = await repository.findByName(entity.name);
    expect(createdTenant.toJSON()).toEqual(entity.toJSON());
  });

  it("should throw an error when tenant is not found by name", async () => {
    expect(repository.findByName("fake-name")).rejects.toThrow(
      new NotFoundError(`Entity not found using Name fake-name`)
    );
  });

  it("should find all players", async () => {
    const tenants = [
      new Tenant({ name: "Liga One" }),
      new Tenant({ name: "Liga Two" }),
    ];
    await repository.bulkInsert(tenants);
    const foundTenants = await repository.findAll();
    expect(JSON.stringify(foundTenants)).toEqual(JSON.stringify(tenants));
  });
});
