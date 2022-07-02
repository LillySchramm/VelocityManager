import { env } from 'process';

export const BIND_PORT = Number(env.BIND_PORT || '80');

export const POSTGRES_URI =
    env.POSTGRES_URI || 'postgresql://localhost:5432/velocitymanager';
export const RABBIT_MQ_URI = env.RABBIT_MQ_URL || 'amqp://localhost';

export const CONTACT_TIMEOUT_SECONDS = BigInt(
    Number(env.CONTACT_TIMEOUT_SECONDS || '10') * 1000
);
