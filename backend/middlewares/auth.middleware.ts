import { NextFunction, Request, Response } from 'express';
import { getSessionById } from '../management/accounts';
import { SESSION_TIMEOUT_IN_MINUTES } from '../tools/config';
import { checkHash } from '../tools/hash';

const IGNORED_PATHS = ['/account/login', '/config/firebase'];

enum AUTH_TYPE {
    BASIC = 'BASIC',
    BEARER = 'BEARER',
}

export const appAuth = async (
    req: Request,
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
        const valid = await verifyBearer(authString);
        if (valid) {
            next();
            return;
        }
    }

    res.sendStatus(401);
};

async function verifyBearer(token: string): Promise<boolean> {
    const tokenComponents = token.split('@');

    if (tokenComponents.length !== 2) {
        return false;
    }

    const id = tokenComponents[0];
    const bearer = tokenComponents[1];

    const session = await getSessionById(id);
    if (!session) {
        return false;
    }

    const timeDelta = Date.now() - session.createdAt.getTime();
    const maxTimeDelta = SESSION_TIMEOUT_IN_MINUTES * 60 * 1000;

    if (timeDelta > maxTimeDelta) {
        return false;
    }

    const valid = await checkHash(session.key, bearer);
    if (!valid) {
        return false;
    }

    return true;
}
