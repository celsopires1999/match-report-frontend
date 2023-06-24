import { DuplicatedError } from "../@seedwork/errors";
import { CreateTenantUseCase } from "./create-tenant.use-case";
import { prisma } from "@/backend/prisma/prisma";

describe.skip("CreatePlayerUseCase Integration Tests", () => {
  let useCase: CreateTenantUseCase;

  beforeEach(async () => {
    await prisma.tenant.deleteMany();
    useCase = new CreateTenantUseCase();
  });

  it("should throw an error on creating a tenant when name exists already", async () => {
    const name = "Fut Veteranos";
    await useCase.execute({ name });
    expect(useCase.execute({ name })).rejects.toThrow(
      new DuplicatedError(`Tenant exists already with name: ${name}`)
    );
  });

  describe("should create player", () => {
    const arrange = [
      {
        send_data: {
          name: "Fut Veteranos",
        },
        expected: {
          name: "Fut Veteranos",
        },
      },
    ];

    test.each(arrange)(
      "when value is $send_data",
      async ({ send_data, expected }) => {
        const output = await useCase.execute(send_data);
        const foundPlayer = await prisma.tenant.findUniqueOrThrow({
          where: { id: output.id },
        });

        expect(output.name).toBe(expected.name);
        expect(foundPlayer.name).toBe(expected.name);
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
