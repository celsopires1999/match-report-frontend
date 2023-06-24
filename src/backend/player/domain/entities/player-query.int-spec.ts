import { UniqueEntityId } from "@/backend/@seedwork/domain/value-objects/unique-entity-id.vo";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { PlayerId } from "./player";
import { PlayerQuery } from "./player-query";

describe("PlayerQuery Integration Tests", () => {
  describe("constructor", () => {
    it("should create a PlayerQuery without PlayerId", () => {
      const name = "Player One";
      const tenant_id = new TenantId();
      const created_at = new Date();
      const updated_at = new Date();

      const playerQuery = new PlayerQuery({
        name,
        tenant_id,
        created_at,
        updated_at,
      });

      expect(playerQuery.name).toBe(name);
      expect(playerQuery.tenant_id).toBe(tenant_id);
      expect(playerQuery.created_at).toBe(created_at);
      expect(playerQuery.updated_at).toBe(updated_at);
      expect(playerQuery.entityId).toBeInstanceOf(UniqueEntityId);
    });

    it("should create a PlayerQuery with PlayerId", () => {
      const playerId = new PlayerId();
      const name = "Player One";
      const tenant_id = new TenantId();
      const created_at = new Date();
      const updated_at = new Date();

      const playerQuery = new PlayerQuery(
        {
          name,
          tenant_id,
          created_at,
          updated_at,
        },
        playerId
      );

      expect(playerQuery.name).toBe(name);
      expect(playerQuery.tenant_id).toBe(tenant_id);
      expect(playerQuery.created_at).toBe(created_at);
      expect(playerQuery.updated_at).toBe(updated_at);
      expect(playerQuery.entityId).toEqual(playerId);

      const playerQueryJson = {
        id: playerQuery.id,
        name,
        tenant_id: tenant_id.value,
        created_at,
        updated_at,
      };
      expect(playerQuery.toJSON()).toEqual(playerQueryJson);
    });
  });
});
