import { PrismaClient, ServerType } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllServerTypes(): Promise<ServerType[]> {
    return await prisma.serverType.findMany();
}
