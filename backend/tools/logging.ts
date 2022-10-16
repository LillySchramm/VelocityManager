import * as winston from 'winston';
import { LOG_FILE } from './config';

export const logger = winston.createLogger({
    level: 'verbose',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: LOG_FILE }),
        new winston.transports.Console({
            format: winston.format.cli(),
        }),
    ],
});
