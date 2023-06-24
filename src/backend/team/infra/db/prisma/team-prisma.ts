import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { LoadEntityError } from "@/backend/@seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { prisma } from "@/backend/prisma/prisma";
import { Team, TeamId } from "@/backend/team/domain/entities/team";
import { TeamQuery } from "@/backend/team/domain/entities/team-query";
import { TeamRepository } from "@/backend/team/domain/repository/team.repository";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { Prisma, TeamModel } from "@prisma/client";

export namespace TeamPrisma {
  export class Repository implements TeamRepository.Interface {
    async insert(entity: Team): Promise<void> {
      try {
        await prisma.teamModel.create({
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

    async bulkInsert(entities: Team[]): Promise<void> {
      const data = entities.map((e) => e.toJSON());
      const batchPayload = await prisma.teamModel.createMany({
        data,
      });

      if (batchPayload.count !== data.length) {
        throw new Error(
          `Not all teams have been created. Requested: ${data.length}, Done: ${batchPayload.count}`
        );
      }
    }

    async findById(id: string | TeamId): Promise<Team> {
      let _id = `${id}`;
      if (typeof id !== "string") {
        _id = id.value;
      }
      const model = await this._get(_id);
      return TeamModelMapper.toEntity(model);
    }

    private async _get(id: string) {
      try {
        return await prisma.teamModel.findUniqueOrThrow({
          where: { id },
        });
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using ID ${id}`, e);
      }
    }

    async findByName(
      name: string,
      tenant_id: string | TenantId
    ): Promise<Team> {
      let _tenant_id = `${tenant_id}`;
      if (typeof tenant_id !== "string") {
        _tenant_id = tenant_id.value;
      }
      try {
        const model = await prisma.teamModel.findFirstOrThrow({
          where: { name, tenant_id: _tenant_id },
        });
        return TeamModelMapper.toEntity(model);
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using Name ${name}`, e);
      }
    }

    async findAll(tenant_id: string | TenantId): Promise<Team[]> {
      let _tenant_id = `${tenant_id}`;
      if (typeof tenant_id !== "string") {
        _tenant_id = tenant_id.value;
      }
      const models = await prisma.teamModel.findMany({
        where: { tenant_id: _tenant_id },
      });
      return models.map((m) => TeamModelMapper.toEntity(m));
    }

    async update(entity: Team): Promise<void> {
      try {
        const { id, ...data } = entity.toJSON();
        await prisma.teamModel.update({
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

    async delete(id: string | TeamId): Promise<void> {
      const _id = typeof id === "string" ? id : id.value;
      try {
        await prisma.teamModel.delete({ where: { id: _id } });
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

    async listAll(tenant_id: string | TenantId): Promise<TeamQuery[]> {
      let _tenant_id = `${tenant_id}`;
      if (typeof tenant_id !== "string") {
        _tenant_id = tenant_id.value;
      }
      const models = await prisma.teamModel.findMany({
        where: { tenant_id: _tenant_id },
      });
      return models.map((m) => TeamQueryModelMapper.toEntity(m));
    }
  }

  export class TeamModelMapper {
    static toEntity(model: TeamModel) {
      const { id, name, tenant_id } = model;
      try {
        return new Team(
          { name, tenant_id: new TenantId(tenant_id) },
          new TeamId(id)
        );
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }

  export class TeamQueryModelMapper {
    static toEntity(model: TeamModel) {
      const { id, name, tenant_id, created_at, updated_at } = model;
      try {
        return new TeamQuery(
          { name, tenant_id: new TenantId(tenant_id), created_at, updated_at },
          new TeamId(id)
        );
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }
}
