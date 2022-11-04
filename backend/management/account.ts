import { Permission, PrismaClient } from '@prisma/client';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import {
    AuthAccount,
    AuthenticatedRequest,
    DeepAccountPermission,
} from '../models/auth.model';
import { RequestError } from '../models/error.model';
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
    {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'api_keys:create',
        description: 'Allows the creation of api keys.',
        default: true,
    },
    {
        id: '00000000-0000-0000-0000-000000000003',
        name: 'api_keys:delete',
        description: 'Allows the deletion of api keys.',
        default: true,
    },
    {
        id: '00000000-0000-0000-0000-000000000004',
        name: 'api_keys:show_all',
        description: 'Allows to view all created api keys regardless of owner.',
        default: false,
    },
];

export async function canAccess(idToken: DecodedIdToken): Promise<AuthAccount> {
    let account = await getAccount(idToken.uid);

    if (!account) {
        initialLoginOccurred = await hasInitialLoginOccurred();
        if (!initialLoginOccurred) {
            return await createAccount(idToken, true, true);
        }

        throw new RequestError('Unauthorized', 401);
    }

    if (!account.activated) {
        throw new RequestError('Account Not Activated', 401);
    }

    const hasAccessRole = account.AccountPermission.some(
        (permission) => permission.permissionId === ACCESS_ID
    );
    if (!hasAccessRole) {
        throw new RequestError('Unauthorized', 401);
    }

    return account;
}

export async function createAccount(
    idToken: DecodedIdToken,
    activated: boolean = false,
    admin: boolean = false
): Promise<AuthAccount> {
    await prisma.account.create({
        data: { id: idToken.uid, name: idToken.name, activated, admin },
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
    const admins = await prisma.account.findMany({
        where: { admin: true },
        include: { AccountPermission: true },
    });

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

        for (let admin of admins) {
            const hasPermission = admin.AccountPermission.some(
                (accountPermission) =>
                    accountPermission.permissionId === permission.id &&
                    !accountPermission.permissionScopeId
            );
            if (hasPermission) {
                continue;
            }

            logger.info(
                `The admin '${admin.name}' does not have the permission '${permission.name}'. Adding...`
            );
            await prisma.accountPermission.create({
                data: { accountId: admin.id, permissionId: permission.id },
            });
        }
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

function matchPermission(
    accountPermission: DeepAccountPermission,
    permission: string,
    scope: string | null = null
) {
    return (
        accountPermission.permission.name === permission &&
        (accountPermission.permissionScopeId === scope ||
            !accountPermission.permissionScopeId)
    );
}

export function assertPermission(
    request: AuthenticatedRequest,
    permission: string,
    scope: string | null = null
): void {
    if (!request.permissions) {
        throw new RequestError('Permissions not available', 501);
    }

    const hasPermission = request.permissions.some((accountPermission) =>
        matchPermission(accountPermission, permission, scope)
    );
    if (!hasPermission) {
        throw new RequestError(
            `The following permission is missing: '${permission}' on scope: ${
                scope ? scope : 'globally'
            }.`,
            403
        );
    }
}

export function assertPermissions(
    request: AuthenticatedRequest,
    permissions: string[],
    scope: string | null = null
): void {
    if (!request.permissions) {
        throw new RequestError('Permissions not available', 501);
    }

    let missingPermissions = permissions.filter(
        (permission) =>
            !request.permissions?.some((accountPermission) =>
                matchPermission(accountPermission, permission, scope)
            )
    );
    if (missingPermissions.length) {
        missingPermissions = missingPermissions.map(
            (permission) => `'${permission}'`
        );
        throw new RequestError(
            `The following permissions are missing: ${missingPermissions.join(
                ', '
            )} on scope: ${scope ? scope : 'globally'}.`,
            403
        );
    }
}
