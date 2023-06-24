import { prisma } from "@/backend/prisma/prisma";
import { DuplicatedError } from "../@seedwork/errors";
import { UpdateTenantUseCase } from "./update-tenant.use-case";

describe.skip("UpdatelayerUseCase Integration Tests", () => {
  let useCase: UpdateTenantUseCase;

  beforeEach(async () => {
    await prisma.tenant.deleteMany();
    useCase = new UpdateTenantUseCase();
  });

  it("should throw an error on updating a tenant when name exists already", async () => {
    const arrange = {
      data: [
        { id: "1", name: "Tenant Name" },
        { id: "2", name: "Other Name" },
      ],
    };
    await prisma.tenant.createMany(arrange);

    const name = "Tenant Name";
    expect(useCase.execute({ id: "2", name: name })).rejects.toThrow(
      new DuplicatedError(`Tenant exists already with name: ${name}`)
    );
  });

  describe("should update player", () => {
    const arrange = [
      {
        send_data: {
          id: "1",
          name: "Fut Veteranos",
        },
        expected: {
          id: "1",
          name: "Fut Veteranos",
        },
      },
      {
        send_data: {
          id: "1",
          name: "Boca Boa",
        },
        expected: {
          id: "1",
          name: "Boca Boa",
        },
      },
    ];

    test.each(arrange)(
      "when value is $send_data",
      async ({ send_data, expected }) => {
        await prisma.tenant.create({ data: { id: "1", name: "xxx" } });
        const output = await useCase.execute(send_data);
        const foundTenant = await prisma.tenant.findUniqueOrThrow({
          where: { id: output.id },
        });

        expect(output.name).toBe(expected.name);
        expect(foundTenant.name).toBe(expected.name);
      }
    );
  });

  // describe("should thrown EntityValidationError", () => {
  //   const arrange = CreatePlayerFixture.arrangeForEntityValidationError();
  //   test.each(arrange)("when label is $label", async ({ send_data }) => {
  //     expect(useCase.execute(send_data as any)).rejects.toThrowError(
  //       EntityValidationError
  //     );
  //   });
  // });
});
