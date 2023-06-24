import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { TeamPlayer, TeamPlayerId } from "../entities/team-player";
import { TeamPlayerQuery } from "../entities/team-player-query";

export namespace TeamPlayerRepository {
  export interface Interface {
    insert(entity: TeamPlayer): Promise<void>;
    bulkInsert(entities: TeamPlayer[]): Promise<void>;
    findById(id: string | TeamPlayerId): Promise<TeamPlayer>;
    findAll(tenant_id: string | TenantId): Promise<TeamPlayer[]>;
    delete(id: string | TeamPlayerId): Promise<void>;
    listAll(tenant_id: string | TenantId): Promise<TeamPlayerQuery[]>;
  }
}
