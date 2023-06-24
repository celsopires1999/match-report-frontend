import { prisma } from "@/backend/prisma/prisma";
import { Prisma } from "@prisma/client";
import { DuplicatedError } from "../@seedwork/errors";

export class UpdateTenantUseCase {
  async execute(input: Input): Promise<Output> {
    const tenant = await prisma.$transaction(async (prisma) => {
      try {
        return await prisma.tenant.update({
          where: { id: input.id },
          data: {
            name: input.name
          }
        });
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          throw new DuplicatedError(`Tenant exists already with name: ${input.name}`);
        } else {
          console.error(e);
          throw e;
        }
      }
    })
    return {
      id: tenant.id,
      name: tenant.name
    }
  }
}

export type Input = {
  id: string,
  name: string
}

export type Output = {
  id: string,
  name: string
}
