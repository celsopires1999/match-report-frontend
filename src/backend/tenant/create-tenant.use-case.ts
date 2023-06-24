import { prisma } from "@/backend/prisma/prisma";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { DuplicatedError } from "../@seedwork/errors";

export class CreateTenantUseCase {
  async execute(input: Input): Promise<Output> {
    const id = uuidv4();

    const tenant = await prisma.$transaction(async (prisma) => {
      try {
        return await prisma.tenantModel.create({
          data: {
            id,
            name: input.name,
          },
        });
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new DuplicatedError(
            `Tenant exists already with name: ${input.name}`
          );
        } else {
          console.error(e);
          throw e;
        }
      }
    });
    return {
      id: tenant.id,
      name: tenant.name,
    };
  }
}

export type Input = {
  name: string;
};

export type Output = {
  id: string;
  name: string;
};
