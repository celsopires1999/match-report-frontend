import { UniqueEntityId } from "@/backend/@seedwork/domain/value-objects/unique-entity-id.vo";
import { PlayerQuery } from "@/backend/player/domain/entities/player-query";
import { TeamQuery } from "@/backend/team/domain/entities/team-query";
import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { TeamPlayerId } from "./team-player";
import { TeamPlayerQuery } from "./team-player-query";

describe("TeamPlayerQuery Integration Tests", () => {
  describe("constructor", () => {
    it("should create a TeamPlayerQuery without TeamPlayerId", () => {
      const tenant_id = new TenantId();
      const created_at = new Date();
      const updated_at = new Date();
      const team = new TeamQuery({
        name: "Team One",
        tenant_id,
        created_at,
        updated_at,
      });
      const player = new PlayerQuery({
        name: "Player One",
        tenant_id,
        created_at,
        updated_at,
      });

      const teamQuery = new TeamPlayerQuery({
        tenant_id,
        team_id: team.entityId,
        player_id: player.entityId,
        created_at,
        updated_at,
        player,
        team,
      });

      expect(teamQuery.tenant_id).toBe(tenant_id);
      expect(teamQuery.team_id).toBe(team.entityId);
      expect(teamQuery.player_id).toBe(player.entityId);
      expect(teamQuery.created_at).toBe(created_at);
      expect(teamQuery.updated_at).toBe(updated_at);
      expect(teamQuery.entityId).toBeInstanceOf(UniqueEntityId);

      const teamQueryJson = {
        id: teamQuery.id,
        tenant_id: tenant_id.value,
        team_id: team.id,
        player_id: player.id,
        created_at,
        updated_at,
        team: team.toJSON(),
        player: player.toJSON(),
      };
      expect(teamQuery.toJSON()).toEqual(teamQueryJson);
    });

    it("should create a TeamPlayerQuery with TeamPlayerId", () => {
      const teamPlayerId = new TeamPlayerId();
      const tenant_id = new TenantId();
      const created_at = new Date();
      const updated_at = new Date();
      const team = new TeamQuery({
        name: "Team One",
        tenant_id,
        created_at,
        updated_at,
      });
      const player = new PlayerQuery({
        name: "Player One",
        tenant_id,
        created_at,
        updated_at,
      });

      const teamQuery = new TeamPlayerQuery(
        {
          tenant_id,
          team_id: team.entityId,
          player_id: player.entityId,
          created_at,
          updated_at,
          player,
          team,
        },
        teamPlayerId
      );

      expect(teamQuery.tenant_id).toBe(tenant_id);
      expect(teamQuery.team_id).toBe(team.entityId);
      expect(teamQuery.player_id).toBe(player.entityId);
      expect(teamQuery.created_at).toBe(created_at);
      expect(teamQuery.updated_at).toBe(updated_at);
      expect(teamQuery.entityId).toEqual(teamPlayerId);
      const teamQueryJson = {
        id: teamQuery.id,
        tenant_id: tenant_id.value,
        team_id: team.id,
        player_id: player.id,
        created_at,
        updated_at,
        team: team.toJSON(),
        player: player.toJSON(),
      };
      expect(teamQuery.toJSON()).toEqual(teamQueryJson);
    });
  });
});
