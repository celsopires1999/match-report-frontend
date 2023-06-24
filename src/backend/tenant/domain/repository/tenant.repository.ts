import { Tenant, TenantId } from "../entities/tenant";

export namespace TenantRepository {
  export interface Interface {
    insert(entity: Tenant): Promise<void>;
    bulkInsert(entities: Tenant[]): Promise<void>;
    findById(id: string | TenantId): Promise<Tenant>;
    findByName(name: string): Promise<Tenant>;
    findAll(): Promise<Tenant[]>;
    update(entity: Tenant): Promise<void>;
    delete(id: string | TenantId): Promise<void>;
  }
}
