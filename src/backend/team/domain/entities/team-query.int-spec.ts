import { UniqueEntityId } from "@/backend/@seedwork/domain/value-objects/unique-entity-id.vo";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { TeamId } from "./team";
import { TeamQuery } from "./team-query";

describe("TeamQuery Integration Tests", () => {
  describe("constructor", () => {
    it("should create a TeamQuery without TeamId", () => {
      const name = "Team One";
      const tenant_id = new TenantId();
      const created_at = new Date();
      const updated_at = new Date();

      const teamQuery = new TeamQuery({
        name,
        tenant_id,
        created_at,
        updated_at,
      });

      expect(teamQuery.name).toBe(name);
      expect(teamQuery.tenant_id).toBe(tenant_id);
      expect(teamQuery.created_at).toBe(created_at);
      expect(teamQuery.updated_at).toBe(updated_at);
      expect(teamQuery.entityId).toBeInstanceOf(UniqueEntityId);
    });

    it("should create a TeamQuery with TeamId", () => {
      const teamId = new TeamId();
      const name = "Team One";
      const tenant_id = new TenantId();
      const created_at = new Date();
      const updated_at = new Date();

      const teamQuery = new TeamQuery(
        {
          name,
          tenant_id,
          created_at,
          updated_at,
        },
        teamId
      );

      expect(teamQuery.name).toBe(name);
      expect(teamQuery.tenant_id).toBe(tenant_id);
      expect(teamQuery.created_at).toBe(created_at);
      expect(teamQuery.updated_at).toBe(updated_at);
      expect(teamQuery.entityId).toEqual(teamId);
      const teamQueryJson = {
        id: teamQuery.id,
        name,
        tenant_id: tenant_id.value,
        created_at,
        updated_at,
      };
      expect(teamQuery.toJSON()).toEqual(teamQueryJson);
    });
  });
});
