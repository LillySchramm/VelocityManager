import { PrismaClient } from '@prisma/client';
import { APIKeyWithCreatorAndPermissions } from '../models/apiKey.model';
import { getRandomString64 } from '../tools/random';

const prisma = new PrismaClient();

export async function getAllApiKeys(): Promise<
    APIKeyWithCreatorAndPermissions[]
> {
    return prisma.aPIKey.findMany({
        include: { createdBy: true, permissions: true },
    });
}

export async function getApiKeysFromAccount(
    accountId: string
): Promise<APIKeyWithCreatorAndPermissions[]> {
    return prisma.aPIKey.findMany({
        include: { createdBy: true, permissions: true },
        where: { accountId },
    });
}

export async function createNewApiKey(
    accountId: string,
    permissions: string[],
    name: string
): Promise<APIKeyWithCreatorAndPermissions> {
    const key = `api-${getRandomString64(200)}`;
    return prisma.aPIKey.create({
        data: {
            key,
            name,
            accountId,
            permissions: {
                connect: permissions.map((permission) => ({
                    name: permission,
                })),
            },
        },
        include: { createdBy: true, permissions: true },
    });
}

export async function deleteApiKey(id: string): Promise<void> {
    await prisma.aPIKey.delete({ where: { id } });
}
