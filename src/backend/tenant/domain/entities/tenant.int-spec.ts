import { Tenant } from "./tenant";

describe("Tenant Integration Tests", () => {
  describe("constructor", () => {
    it("should throw an error when name is invalid ", () => {
      expect(() => new Tenant({ name: null } as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => new Tenant({ name: "" } as any)).containsErrorMessages({
        name: ["name should not be empty", "name must be longer than or equal to 3 characters"],
      });

      expect(() => new Tenant({ name: 5 as any } as any)).containsErrorMessages(
        {
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
            "name must be longer than or equal to 3 characters",
          ],
        }
      );

      expect(
        () => new Tenant({ name: "t".repeat(256) } as any)
      ).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });
  });

  describe("update method", () => {
    it("should throw an error when name is invalid", () => {
      const tenant = new Tenant({
        name: "Tenant 1",
      } as any);
      expect(() => tenant.update(null as any)).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => tenant.update("")).containsErrorMessages({
        name: ["name should not be empty", "name must be longer than or equal to 3 characters"],
      });

      expect(() => tenant.update(5 as any)).containsErrorMessages({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
          "name must be longer than or equal to 3 characters",
        ],
      });

      expect(() => tenant.update("t".repeat(256))).containsErrorMessages({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    it("should update a tenant with valid properties", () => {
      expect.assertions(0);
      const player = new Tenant({
        name: "Tenant 1",
      });
      player.update("Tenant 2");
    });
  });
});
