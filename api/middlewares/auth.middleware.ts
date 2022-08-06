import { NextFunction, Request, Response } from 'express';

export const appAuth = (req: Request, res: Response, next: NextFunction) => {
    next();
};
