import { prisma } from "@/backend/prisma/prisma";

export async function initializePrisma() {
  await prisma.teamPlayerModel.deleteMany();
  await prisma.teamModel.deleteMany();
  await prisma.playerModel.deleteMany();
  await prisma.tenantModel.deleteMany();
  await prisma.gameModel.deleteMany();
}
