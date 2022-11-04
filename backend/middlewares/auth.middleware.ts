import { NextFunction, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { canAccess } from '../management/account';
import { verifyApiKey } from '../management/apiKey';
import {
    AuthenticatedRequest,
    AuthType,
    DeepAccountPermission,
} from '../models/auth.model';
import { RequestError } from '../models/error.model';
import feAdmin from '../tools/firebase';

const IGNORED_PATHS = ['/account/login', '/config/firebase'];

enum AUTH_TYPE {
    BASIC = 'BASIC',
    BEARER = 'BEARER',
}

export const appAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const path = req.path;
    const authorization = req.headers.authorization;

    if (IGNORED_PATHS.includes(path)) {
        next();
        return;
    }

    if (!authorization) {
        throw new RequestError('Unauthorized', 401);
    }

    const authType = authorization.split(' ')[0].toUpperCase() as AUTH_TYPE;
    const authString = authorization.split(' ')[1];

    if (authType === AUTH_TYPE.BASIC && authString) {
        next(); // Placeholder
        return;
    }

    if (authType === AUTH_TYPE.BEARER && authString) {
        let user, permissions, authType;

        if (authString.startsWith('api-')) {
            const apiKey = await verifyApiKey(authString);
            user = {
                uid: apiKey.accountId,
                name: apiKey.createdBy.name,
            } as unknown as DecodedIdToken;
            permissions = apiKey.permissions.map(
                (permission) =>
                    ({
                        permission,
                        scope: null,
                        permissionScopeId: null,
                    } as DeepAccountPermission)
            );
            authType = AuthType.API_KEY;
        } else {
            user = await getUserUid(authString);
            const account = await canAccess(user);
            permissions = account.AccountPermission;
            authType = AuthType.TOKEN;
        }

        req.user = user;
        req.permissions = permissions;
        next();
        return;
    }

    throw new RequestError('Unauthorized', 401);
};

async function getUserUid(token: string): Promise<DecodedIdToken> {
    try {
        const userInfo = await feAdmin.auth().verifyIdToken(token);
        return userInfo;
    } catch (e) {
        console.log(e);
    }

    throw new RequestError('AuthToken invalid.', 401);
}
