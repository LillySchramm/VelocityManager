import { Permission, PrismaClient } from '@prisma/client';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { AuthAccount } from '../models/auth.model';
import { logger } from '../tools/logging';

const prisma = new PrismaClient();
let initialLoginOccurred = false;

const ACCESS_ID = '00000000-0000-0000-0000-000000000001';
const permissions = [
    {
        id: ACCESS_ID,
        name: 'system:access',
        description: 'Required to access any service.',
        default: true,
    },
];

export async function canAccess(
    idToken: DecodedIdToken
): Promise<AuthAccount | null> {
    let account = await getAccount(idToken.uid);

    if (!account) {
        initialLoginOccurred = await hasInitialLoginOccurred();
        if (!initialLoginOccurred) {
            return await createAccount(idToken, true);
        }

        return null;
    }

    const hasAccessRole = account.AccountPermission.some(
        (permission) => permission.permissionId === ACCESS_ID
    );

    return hasAccessRole ? account : null;
}

export async function createAccount(
    idToken: DecodedIdToken,
    activated: boolean = false
): Promise<AuthAccount> {
    await prisma.account.create({
        data: { id: idToken.uid, name: idToken.name, activated },
    });

    const defaultPermissions = await getAllDefaultPermissions();
    await prisma.accountPermission.createMany({
        data: defaultPermissions.map((permission) => ({
            accountId: idToken.uid,
            permissionId: permission.id,
        })),
    });

    return (await getAccount(idToken.uid))!;
}

export async function getAccount(id: string): Promise<AuthAccount | null> {
    return prisma.account.findFirst({
        where: { id },
        include: {
            AccountPermission: { include: { permission: true, scope: true } },
        },
    });
}

export async function getAllDefaultPermissions(): Promise<Permission[]> {
    return prisma.permission.findMany({ where: { default: true } });
}

export async function initializePermissions(): Promise<void> {
    for (let permission of permissions) {
        await prisma.permission.upsert({
            where: { id: permission.id },
            create: {
                id: permission.id,
                name: permission.name,
                description: permission.description,
            },
            update: {
                description: permission.description,
                default: permission.default,
            },
        });
    }
}

async function hasInitialLoginOccurred(): Promise<boolean> {
    if (initialLoginOccurred) {
        return true;
    }

    const initialAccountCount = await prisma.account.count();
    initialLoginOccurred = !!initialAccountCount;

    return initialLoginOccurred;
}

export async function initializeAccounts(): Promise<void> {
    const initialLoginOccurred = await hasInitialLoginOccurred();

    if (initialLoginOccurred) {
        return;
    }

    logger.warn('Initial login has not occurred.');
    logger.warn('The first user to login will become the admin.');
}
