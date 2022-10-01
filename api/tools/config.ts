import { env } from 'process';

export const BIND_PORT = Number(env.BIND_PORT || '30001');

export const POSTGRES_URI =
    env.POSTGRES_URI || 'postgresql://localhost:5432/velocitymanager';
export const RABBIT_MQ_URI = env.RABBIT_MQ_URL || 'amqp://localhost';

export const RABBIT_MQ_PREFIX =
    env.RABBIT_MQ_PREFIX || 'eps-dev.velocity-manager';

export const CONTACT_TIMEOUT_SECONDS = BigInt(
    Number(env.CONTACT_TIMEOUT_SECONDS || '10') * 1000
);

export const LOG_FILE = env.LOG_FILE || 'logs/combined.log';

export const TOTP_ISSUER = env.TOTP_ISSUER || 'VelocityManager';

export const SESSION_TIMEOUT_IN_MINUTES =
    Number(env.SESSION_TIMEOUT_IN_MINUTES) || 600;

export const DEFAULT_KICK_MESSAGE = 'You have been kicked by an admin.';
