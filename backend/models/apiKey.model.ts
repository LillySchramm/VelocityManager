import { Account, APIKey, Permission } from '@prisma/client';

export type APIKeyWithCreatorAndPermissions = APIKey & {
    createdBy: Account;
    permissions: Permission[];
};
