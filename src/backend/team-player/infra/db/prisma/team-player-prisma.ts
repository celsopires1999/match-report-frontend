import { DuplicatedError } from "@/backend/@seedwork/domain/errors/duplicated.error";
import { LoadEntityError } from "@/backend/@seedwork/domain/errors/load-entity.error";
import { NotFoundError } from "@/backend/@seedwork/domain/errors/not-found.error";
import { EntityValidationError } from "@/backend/@seedwork/domain/errors/validation-error";
import { PlayerId } from "@/backend/player/domain/entities/player";
import { PlayerQuery } from "@/backend/player/domain/entities/player-query";
import { prisma } from "@/backend/prisma/prisma";
import {
  TeamPlayer,
  TeamPlayerId,
} from "@/backend/team-player/domain/entities/team-player";
import { TeamPlayerQuery } from "@/backend/team-player/domain/entities/team-player-query";
import { TeamPlayerRepository } from "@/backend/team-player/domain/repository/team-player.repository";
import { TeamId } from "@/backend/team/domain/entities/team";
import { TeamQuery } from "@/backend/team/domain/entities/team-query";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import {
  PlayerModel,
  Prisma,
  TeamModel,
  TeamPlayerModel,
} from "@prisma/client";

export namespace TeamPlayerPrisma {
  export class Repository implements TeamPlayerRepository.Interface {
    async insert(entity: TeamPlayer): Promise<void> {
      try {
        await prisma.teamPlayerModel.create({
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

    async bulkInsert(entities: TeamPlayer[]): Promise<void> {
      const data = entities.map((e) => e.toJSON());
      const batchPayload = await prisma.teamPlayerModel.createMany({
        data,
      });

      if (batchPayload.count !== data.length) {
        throw new Error(
          `Not all teams have been created. Requested: ${data.length}, Done: ${batchPayload.count}`
        );
      }
    }

    async findById(id: string | TeamPlayerId): Promise<TeamPlayer> {
      let _id = `${id}`;
      if (typeof id !== "string") {
        _id = id.value;
      }
      const model = await this._get(_id);
      return TeamPlayerModelMapper.toEntity(model);
    }

    private async _get(id: string) {
      try {
        return await prisma.teamPlayerModel.findUniqueOrThrow({
          where: { id },
        });
      } catch (e) {
        throw this.checkNotFoundError(`Entity not found using ID ${id}`, e);
      }
    }

    async findAll(tenant_id: string | TenantId): Promise<TeamPlayer[]> {
      let _tenant_id = `${tenant_id}`;
      if (typeof tenant_id !== "string") {
        _tenant_id = tenant_id.value;
      }
      const models = await prisma.teamPlayerModel.findMany({
        where: { tenant_id: _tenant_id },
      });
      return models.map((m) => TeamPlayerModelMapper.toEntity(m));
    }

    async delete(id: string | TeamPlayerId): Promise<void> {
      const _id = typeof id === "string" ? id : id.value;
      try {
        await prisma.teamPlayerModel.delete({ where: { id: _id } });
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

    async listAll(tenant_id: string | TenantId): Promise<TeamPlayerQuery[]> {
      let _tenant_id = `${tenant_id}`;
      if (typeof tenant_id !== "string") {
        _tenant_id = tenant_id.value;
      }
      const models = await prisma.teamPlayerModel.findMany({
        where: { tenant_id: _tenant_id },
        include: {
          Team: true,
          Player: true,
        },
      });
      return models.map((m) => TeamPlayerQueryModelMapper.toEntity(m));
    }
  }

  export class TeamPlayerModelMapper {
    static toEntity(model: TeamPlayerModel) {
      const { id, tenant_id, team_id, player_id } = model;
      try {
        return new TeamPlayer(
          {
            tenant_id: new TenantId(tenant_id),
            team_id: new TeamId(team_id),
            player_id: new PlayerId(player_id),
          },
          new TeamPlayerId(id)
        );
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }

        throw e;
      }
    }
  }

  export class TeamPlayerQueryModelMapper {
    static toEntity(
      model: TeamPlayerModel & { Team: TeamModel } & { Player: PlayerModel }
    ) {
      const {
        id,
        tenant_id,
        team_id,
        player_id,
        Team,
        Player,
        created_at,
        updated_at,
      } = model;
      try {
        return new TeamPlayerQuery(
          {
            tenant_id: new TenantId(tenant_id),
            team_id: new TeamId(team_id),
            player_id: new PlayerId(player_id),
            team: new TeamQuery(
              {
                name: Team.name,
                tenant_id: new TenantId(Team.tenant_id),
                created_at: new Date(Team.created_at),
                updated_at: new Date(Team.updated_at),
              },
              new TeamId(Team.id)
            ),
            player: new PlayerQuery(
              {
                name: Player.name,
                tenant_id: new TenantId(Player.tenant_id),
                created_at: new Date(Player.created_at),
                updated_at: new Date(Player.updated_at),
              },
              new PlayerId(Player.id)
            ),
            created_at,
            updated_at,
          },
          new TeamPlayerId(id)
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
