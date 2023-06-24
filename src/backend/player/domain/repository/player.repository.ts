import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { Player, PlayerId } from "../entities/player";
import { PlayerQuery } from "../entities/player-query";

export namespace PlayerRepository {
  export interface Interface {
    insert(entity: Player): Promise<void>;
    bulkInsert(entities: Player[]): Promise<void>;
    findById(id: string | PlayerId): Promise<Player>;
    findByName(name: string, tenant_id: string | TenantId): Promise<Player>;
    findAll(tenant_id: string | TenantId): Promise<Player[]>;
    update(entity: Player): Promise<void>;
    delete(id: string | PlayerId): Promise<void>;
    listAll(tenant_id: string | TenantId): Promise<PlayerQuery[]>;
  }
}
