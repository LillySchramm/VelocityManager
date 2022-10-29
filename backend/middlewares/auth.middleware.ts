import { NextFunction, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { canAccess } from '../management/account';
import { AuthenticatedRequest } from '../models/auth.model';
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
        res.sendStatus(401);
        return;
    }

    const authType = authorization.split(' ')[0].toUpperCase() as AUTH_TYPE;
    const authString = authorization.split(' ')[1];

    if (authType === AUTH_TYPE.BASIC && authString) {
        next(); // Placeholder
        return;
    }

    if (authType === AUTH_TYPE.BEARER && authString) {
        const user = await getUserUid(authString);
        if (user) {
            req.user = user;
            const account = await canAccess(user);
            if (account) {
                req.permissions = account.AccountPermission;
                next();
                return;
            }
        }
    }

    res.sendStatus(401);
};

async function getUserUid(token: string): Promise<DecodedIdToken | undefined> {
    try {
        const userInfo = await feAdmin.auth().verifyIdToken(token);
        return userInfo;
    } catch (e) {
        console.log(e);
    }
}
