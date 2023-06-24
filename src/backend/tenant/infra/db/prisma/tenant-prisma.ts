import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { LoadEntityError } from "@/backend/@seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { prisma } from "@/backend/prisma/prisma";
import { Tenant, TenantId } from "@/backend/tenant/domain/entities/tenant";
import { TenantRepository } from "@/backend/tenant/domain/repository/tenant.repository";
import { Prisma, TenantModel } from "@prisma/client";

export namespace TenantPrisma {
  export class Repository implements TenantRepository.Interface {
    async insert(entity: Tenant): Promise<void> {
      try {
        await prisma.tenantModel.create({
          data: entity.toJSON(),
        });
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new DuplicatedError(`Entity duplicated with ID ${entity.id}`);
        } else {
          throw e;
        }
      }
    }

    async bulkInsert(entities: Tenant[]): Promise<void> {
      const data = entities.map((e) => e.toJSON());
      const batchPayload = await prisma.tenantModel.createMany({
        data,
      });

      if (batchPayload.count !== data.length) {
        throw new Error(
          `Not all tenants have been created. Requested: ${data.length}, Done: ${batchPayload.count}`
        );
      }
    }

    async findById(id: string | TenantId): Promise<Tenant> {
      let _id = `${id}`;
      if (typeof id !== "string") {
        _id = id.value;
      }
      const model = await this._get(_id);
      return TenantModelMapper.toEntity(model);
    }

    private async _get(id: string) {
      try {
        return await prisma.tenantModel.findUniqueOrThrow({
          where: { id },
        });
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using ID ${id}`, e);
      }
    }

    async findByName(name: string): Promise<Tenant> {
      try {
        const model = await prisma.tenantModel.findUniqueOrThrow({
          where: { name },
        });
        return TenantModelMapper.toEntity(model);
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using Name ${name}`, e);
      }
    }

    async findAll(): Promise<Tenant[]> {
      const models = await prisma.tenantModel.findMany();
      return models.map((m) => TenantModelMapper.toEntity(m));
    }

    async update(entity: Tenant): Promise<void> {
      try {
        const { id, ...data } = entity.toJSON();
        await prisma.tenantModel.update({
          where: { id },
          data,
        });
      } catch (e) {
        throw this.checkNotFoundError(
          `Entity not found using ID ${entity.id}`,
          e
        );
      }
    }

    async delete(id: string | TenantId): Promise<void> {
      const _id = typeof id === "string" ? id : id.value;
      try {
        await prisma.tenantModel.delete({ where: { id: _id } });
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using ID ${_id}`, e);
      }
    }

    private checkNotFoundError(msg: string, e: unknown) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        return new NotFoundError(msg);
      } else {
        return e;
      }
    }
  }

  export class TenantModelMapper {
    static toEntity(model: TenantModel) {
      const { id, name } = model;
      try {
        return new Tenant({ name }, new TenantId(id));
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }
}
