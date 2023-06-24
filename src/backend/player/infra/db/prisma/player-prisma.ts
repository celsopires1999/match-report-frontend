import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { LoadEntityError } from "@/backend/@seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { Player, PlayerId } from "@/backend/player/domain/entities/player";
import { PlayerQuery } from "@/backend/player/domain/entities/player-query";
import { PlayerRepository } from "@/backend/player/domain/repository/player.repository";
import { prisma } from "@/backend/prisma/prisma";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { PlayerModel, Prisma } from "@prisma/client";

export namespace PlayerPrisma {
  export class Repository implements PlayerRepository.Interface {
    async insert(entity: Player): Promise<void> {
      try {
        await prisma.playerModel.create({
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

    async bulkInsert(entities: Player[]): Promise<void> {
      const data = entities.map((e) => e.toJSON());
      const batchPayload = await prisma.playerModel.createMany({
        data,
      });

      if (batchPayload.count !== data.length) {
        throw new Error(
          `Not all players have been created. Requested: ${data.length}, Done: ${batchPayload.count}`
        );
      }
    }

    async findById(id: string | PlayerId): Promise<Player> {
      let _id = `${id}`;
      if (typeof id !== "string") {
        _id = id.value;
      }
      const model = await this._get(_id);
      return PlayerModelMapper.toEntity(model);
    }

    private async _get(id: string) {
      try {
        return await prisma.playerModel.findUniqueOrThrow({
          where: { id },
        });
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using ID ${id}`, e);
      }
    }

    async findByName(
      name: string,
      tenant_id: string | TenantId
    ): Promise<Player> {
      let _tenant_id = `${tenant_id}`;
      if (typeof tenant_id !== "string") {
        _tenant_id = tenant_id.value;
      }
      try {
        const model = await prisma.playerModel.findFirstOrThrow({
          where: { name, tenant_id: _tenant_id },
        });
        return PlayerModelMapper.toEntity(model);
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using Name ${name}`, e);
      }
    }

    async findAll(tenant_id: string | TenantId): Promise<Player[]> {
      let _tenant_id = `${tenant_id}`;
      if (typeof tenant_id !== "string") {
        _tenant_id = tenant_id.value;
      }
      const models = await prisma.playerModel.findMany({
        where: { tenant_id: _tenant_id },
      });
      return models.map((m) => PlayerModelMapper.toEntity(m));
    }

    async update(entity: Player): Promise<void> {
      try {
        const { id, ...data } = entity.toJSON();
        await prisma.playerModel.update({
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

    async delete(id: string | PlayerId): Promise<void> {
      const _id = typeof id === "string" ? id : id.value;
      try {
        await prisma.playerModel.delete({ where: { id: _id } });
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using ID ${_id}`, e);
      }
    }

    async listAll(tenant_id: string | TenantId): Promise<PlayerQuery[]> {
      let _tenant_id = `${tenant_id}`;
      if (typeof tenant_id !== "string") {
        _tenant_id = tenant_id.value;
      }
      const models = await prisma.playerModel.findMany({
        where: { tenant_id: _tenant_id },
      });
      return models.map((m) => PlayerQueryModelMapper.toEntity(m));
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

  export class PlayerModelMapper {
    static toEntity(model: PlayerModel) {
      const { id, name, tenant_id } = model;
      try {
        return new Player(
          { name, tenant_id: new TenantId(tenant_id) },
          new PlayerId(id)
        );
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }

  export class PlayerQueryModelMapper {
    static toEntity(model: PlayerModel) {
      const { id, name, tenant_id, created_at, updated_at } = model;
      try {
        return new PlayerQuery(
          { name, tenant_id: new TenantId(tenant_id), created_at, updated_at },
          new PlayerId(id)
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
