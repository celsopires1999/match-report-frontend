import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { LoadEntityError } from "@/backend/@seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { Game, GameId } from "@/backend/game/domain/entities/game";
import { GameQuery } from "@/backend/game/domain/entities/game-query";
import { GameRepository } from "@/backend/game/domain/repository/game.repository";
import { GameTeam } from "@/backend/game/domain/value-objects/game-team.vo";
import { prisma } from "@/backend/prisma/prisma";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { GameModel, Prisma } from "@prisma/client";

export namespace GamePrisma {
  export class Repository implements GameRepository.Interface {
    findByName(name: string, tenant_id: string | TenantId): Promise<Game> {
      throw new Error("Method not implemented.");
    }

    async insert(entity: Game): Promise<void> {
      try {
        await prisma.gameModel.create({
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

    async bulkInsert(entities: Game[]): Promise<void> {
      const data = entities.map((e) => e.toJSON());
      const batchPayload = await prisma.gameModel.createMany({
        data,
      });

      if (batchPayload.count !== data.length) {
        throw new Error(
          `Not all games have been created. Requested: ${data.length}, Done: ${batchPayload.count}`
        );
      }
    }

    async findById(
      tenant_id: string | TenantId,
      id: string | GameId
    ): Promise<Game> {
      const _tenant_id =
        typeof tenant_id === "string" ? tenant_id : tenant_id.value;
      const _id = typeof id === "string" ? id : id.value;

      const model = await this._get(_tenant_id, _id);
      return GameModelMapper.toEntity(model);
    }

    private async _get(tenant_id: string, id: string) {
      try {
        return await prisma.gameModel.findUniqueOrThrow({
          where: { tenant_id, id },
        });
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using ID ${id}`, e);
      }
    }

    // async findByName(
    //   name: string,
    //   tenant_id: string | TenantId
    // ): Promise<Game> {
    //   let _tenant_id = `${tenant_id}`;
    //   if (typeof tenant_id !== "string") {
    //     _tenant_id = tenant_id.value;
    //   }
    //   try {
    //     const model = await prisma.gameModel.findFirstOrThrow({
    //       where: { name, tenant_id: _tenant_id },
    //     });
    //     return GameModelMapper.toEntity(model);
    //   } catch (e) {
    //     throw this.checkNotFoundError(`Entity not found using Name ${name}`, e);
    //   }
    // }

    async findAll(tenant_id: string | TenantId): Promise<Game[]> {
      const _tenant_id =
        typeof tenant_id === "string" ? tenant_id : tenant_id.value;

      const models = await prisma.gameModel.findMany({
        where: { tenant_id: _tenant_id },
      });
      return models.map((m) => GameModelMapper.toEntity(m));
    }

    async update(tenant_id: string | TenantId, entity: Game): Promise<void> {
      const _tenant_id =
        typeof tenant_id === "string" ? tenant_id : tenant_id.value;

      try {
        const { id, ...data } = entity.toJSON();
        await prisma.gameModel.update({
          where: { tenant_id: _tenant_id, id },
          data,
        });
      } catch (e) {
        throw this.checkNotFoundError(
          `Entity not found using ID ${entity.id}`,
          e
        );
      }
    }

    async delete(
      tenant_id: string | TenantId,
      id: string | GameId
    ): Promise<void> {
      const _tenant_id =
        typeof tenant_id === "string" ? tenant_id : tenant_id.value;
      const _id = typeof id === "string" ? id : id.value;
      try {
        await prisma.gameModel.delete({
          where: { tenant_id: _tenant_id, id: _id },
        });
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using ID ${_id}`, e);
      }
    }

    async listAll(tenant_id: string | TenantId): Promise<GameQuery[]> {
      let _tenant_id = `${tenant_id}`;
      if (typeof tenant_id !== "string") {
        _tenant_id = tenant_id.value;
      }
      const models = await prisma.gameModel.findMany({
        where: { tenant_id: _tenant_id },
      });
      return models.map((m) => GameQueryModelMapper.toEntity(m));
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

  export class GameModelMapper {
    static toEntity(model: GameModel) {
      const {
        id,
        tenant_id,
        date,
        place,
        home: homeJSON,
        away: awayJSON,
      } = model;
      try {
        const home = GameTeam.createFromJSON(homeJSON);
        const away = GameTeam.createFromJSON(awayJSON);
        return new Game(
          {
            tenant_id: new TenantId(tenant_id),
            date,
            place,
            home,
            away,
          },
          new GameId(id)
        );
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }
        throw e;
      }
    }
  }

  export class GameQueryModelMapper {
    static toEntity(model: GameModel) {
      const {
        id,
        tenant_id,
        date,
        place,
        home: homeJSON,
        away: awayJSON,
        created_at,
        updated_at,
      } = model;
      try {
        const home = GameTeam.createFromJSON(homeJSON);
        const away = GameTeam.createFromJSON(awayJSON);
        return new GameQuery(
          {
            tenant_id: new TenantId(tenant_id),
            date,
            place,
            home,
            away,
            created_at,
            updated_at,
          },
          new GameId(id)
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
