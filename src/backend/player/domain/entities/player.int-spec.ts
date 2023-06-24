import { TenantId } from "@/backend/tenant/domain/entities/tenant";
import { Player } from "./player";

describe("Player Integration Tests", () => {
  describe("constructor", () => {
    it("should throw an error when name is invalid ", () => {
      expect(() => new Player({ name: null } as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => new Player({ name: "" } as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => new Player({ name: 5 as any } as any)).containsErrorMessages(
        {
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
            "name must be longer than or equal to 3 characters",
          ],
        }
      );

      expect(
        () => new Player({ name: "t".repeat(256) } as any)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should throw an error when tenant_id is invalid ", () => {
      expect(() => new Player({ name: "name" } as any)).containsErrorMessages({
        tenant_id: [
          "tenant_id must be an instance of TenantId",
          "tenant_id should not be empty",
          "tenant_id must be a non-empty object",
        ],
      });

      expect(
        () => new Player({ name: "name", tenant_id: "fake-id" } as any)
      ).containsErrorMessages({
        tenant_id: [
          "tenant_id must be an instance of TenantId",
          "tenant_id must be a non-empty object",
        ],
      });

      expect(
        () => new Player({ name: "name", tenant_id: new Date() } as any)
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
      const player = new Player({
        name: "Player 1",
        tenant_id: new TenantId(),
      });
      expect(() => player.update(null as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => player.update("")).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => player.update(5 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => player.update("t".repeat(256))).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should update a tenant with valid properties", () => {
      expect.assertions(0);
      const player = new Player({
        name: "Player 1",
        tenant_id: new TenantId(),
      });
      player.update("Player 2");
    });
  });
});
