import {
    Account,
    AccountPermission,
    Permission,
    PermissionScope,
} from '@prisma/client';
import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export type AuthenticatedRequest = Request<
    {},
    any,
    any,
    any,
    Record<string, any>
> & { user?: DecodedIdToken; permissions?: AccountPermission[] };

export type AuthAccount = Account & {
    AccountPermission: (AccountPermission & {
        permission: Permission;
        scope: PermissionScope | null;
    })[];
};
