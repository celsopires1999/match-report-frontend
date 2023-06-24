import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { Game, GameId } from "../entities/game";
// import { GameQuery } from "../entities/game-query";

export namespace GameRepository {
  export interface Interface {
    insert(entity: Game): Promise<void>;
    bulkInsert(entities: Game[]): Promise<void>;
    findById(tenant_id: string | TenantId, id: string | GameId): Promise<Game>;
    findByName(name: string, tenant_id: string | TenantId): Promise<Game>;
    findAll(tenant_id: string | TenantId): Promise<Game[]>;
    update(tenant_id: string | TenantId, entity: Game): Promise<void>;
    delete(tenant_id: string | TenantId, id: string | GameId): Promise<void>;
    // listAll(tenant_id: string | TenantId): Promise<GameQuery[]>;
  }
}
