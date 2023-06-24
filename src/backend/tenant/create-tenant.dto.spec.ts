import { EntityValidationError } from "../@seedwork/errors";
import { CreateTenantDto } from "./create-tenant.dto";

describe.skip("Create Tenant DTO", () => {
  it("should thrown an error", () => {
    expect.assertions(1);
    try {
      CreateTenantDto.validate({ name: "" });
    } catch (e) {
      if (e instanceof EntityValidationError) {
        expect(e.error).toStrictEqual({
          name: [
            "name must be longer than or equal to 3 characters",
            "name should not be empty",
          ],
        });
      }
    }
  });

  it("should be valid", () => {
    const dto = CreateTenantDto.validate({ name: "Fut Veteranos" });
    expect(dto.name).toBe("Fut Veteranos");
  });
});
