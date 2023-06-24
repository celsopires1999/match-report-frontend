import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { Team } from "./team";

describe("Team Integration Tests", () => {
  describe("constructor", () => {
    it("should throw an error when name is invalid ", () => {
      expect(() => new Team({ name: null } as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => new Team({ name: "" } as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => new Team({ name: 5 as any } as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(
        () => new Team({ name: "t".repeat(256) } as any)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should throw an error when tenant_id is invalid ", () => {
      expect(() => new Team({ name: "name" } as any)).containsErrorMessages({
        tenant_id: [
          "tenant_id must be an instance of TenantId",
          "tenant_id should not be empty",
          "tenant_id must be a non-empty object",
        ],
      });

      expect(
        () => new Team({ name: "name", tenant_id: "fake-id" } as any)
      ).containsErrorMessages({
        tenant_id: [
          "tenant_id must be an instance of TenantId",
          "tenant_id must be a non-empty object",
        ],
      });

      expect(
        () => new Team({ name: "name", tenant_id: new Date() } as any)
      ).containsErrorMessages({
        tenant_id: [
          "tenant_id must be an instance of TenantId",
          "tenant_id must be a non-empty object",
        ],
      });
    });
  });

  describe("update method", () => {
    it("should throw an error when name is invalid", () => {
      const team = new Team({
        name: "Team 1",
        tenant_id: new TenantId(),
      });
      expect(() => team.update(null as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => team.update("")).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => team.update(5 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => team.update("t".repeat(256))).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should update a tenant with valid properties", () => {
      expect.assertions(0);
      const team = new Team({
        name: "Team 1",
        tenant_id: new TenantId(),
      });
      team.update("Team 2");
    });
  });
});
