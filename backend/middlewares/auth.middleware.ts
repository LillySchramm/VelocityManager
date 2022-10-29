import { NextFunction, Response } from 'express';
import feAdmin from '../tools/firebase';
import { logger } from '../tools/logging';

const IGNORED_PATHS = ['/account/login', '/config/firebase'];

enum AUTH_TYPE {
    BASIC = 'BASIC',
    BEARER = 'BEARER',
}

export const appAuth = async (req: any, res: Response, next: NextFunction) => {
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
        const uid = await getUserUid(authString);
        logger.info(JSON.stringify({ uid }));
        if (uid) {
            req.uid = uid;
            next();
            return;
        }
    }

    res.sendStatus(401);
};

async function getUserUid(token: string): Promise<string> {
    try {
        const userInfo = await feAdmin.auth().verifyIdToken(token);
        return userInfo.uid;
    } catch (e) {
        console.log(e);
        return '';
    }
}
