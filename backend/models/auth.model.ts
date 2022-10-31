import {
    Account,
    AccountPermission,
    Permission,
    PermissionScope,
} from '@prisma/client';
import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export type AuthenticatedRequest = Request<
    any,
    any,
    any,
    any,
    Record<string, any>
> & { user?: DecodedIdToken; permissions?: DeepAccountPermission[] };

export type AuthAccount = Account & {
    AccountPermission: DeepAccountPermission[];
};

export type DeepAccountPermission = AccountPermission & {
    permission: Permission;
    scope: PermissionScope | null;
};
