import { TeamPlayer } from "./team-player";

describe("TeamPlayer Integration Tests", () => {
  describe("constructor", () => {
    it("should throw an error when tenant_id is invalid ", () => {
      expect(
        () => new TeamPlayer({ tenant_id: null } as any)
      ).containsErrorMessages({
        tenant_id: [
          "tenant_id must be an instance of TenantId",
          "tenant_id should not be empty",
          "tenant_id must be a non-empty object",
        ],
      });

      expect(
        () => new TeamPlayer({ tenant_id: "fake-id" } as any)
      ).containsErrorMessages({
        tenant_id: [
          "tenant_id must be an instance of TenantId",
          "tenant_id must be a non-empty object",
        ],
      });

      expect(
        () => new TeamPlayer({ tenant_id: new Date() } as any)
      ).containsErrorMessages({
        tenant_id: [
          "tenant_id must be an instance of TenantId",
          "tenant_id must be a non-empty object",
        ],
      });
    });

    it("should throw an error when team_id is invalid ", () => {
      expect(
        () => new TeamPlayer({ team_id: null } as any)
      ).containsErrorMessages({
        team_id: [
          "team_id must be an instance of TeamId",
          "team_id should not be empty",
          "team_id must be a non-empty object",
        ],
      });

      expect(
        () => new TeamPlayer({ team_id: "fake-id" } as any)
      ).containsErrorMessages({
        team_id: [
          "team_id must be an instance of TeamId",
          "team_id must be a non-empty object",
        ],
      });

      expect(
        () => new TeamPlayer({ team_id: new Date() } as any)
      ).containsErrorMessages({
        team_id: [
          "team_id must be an instance of TeamId",
          "team_id must be a non-empty object",
        ],
      });
    });

    it("should throw an error when player_id is invalid ", () => {
      expect(
        () => new TeamPlayer({ player_id: null } as any)
      ).containsErrorMessages({
        player_id: [
          "player_id must be an instance of PlayerId",
          "player_id should not be empty",
          "player_id must be a non-empty object",
        ],
      });

      expect(
        () => new TeamPlayer({ player_id: "fake-id" } as any)
      ).containsErrorMessages({
        player_id: [
          "player_id must be an instance of PlayerId",
          "player_id must be a non-empty object",
        ],
      });

      expect(
        () => new TeamPlayer({ player_id: new Date() } as any)
      ).containsErrorMessages({
        player_id: [
          "player_id must be an instance of PlayerId",
          "player_id must be a non-empty object",
        ],
      });
    });
  });
});
