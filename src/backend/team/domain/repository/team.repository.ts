import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { Team, TeamId } from "../entities/team";
import { TeamQuery } from "../entities/team-query";

export namespace TeamRepository {
  export interface Interface {
    insert(entity: Team): Promise<void>;
    bulkInsert(entities: Team[]): Promise<void>;
    findById(id: string | TeamId): Promise<Team>;
    findByName(name: string, tenant_id: string | TenantId): Promise<Team>;
    findAll(tenant_id: string | TenantId): Promise<Team[]>;
    update(entity: Team): Promise<void>;
    delete(id: string | TeamId): Promise<void>;
    listAll(tenant_id: string | TenantId): Promise<TeamQuery[]>;
  }
}
