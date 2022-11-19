import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import { RabbitMQ } from './rabbitmq/rabbitmq';
import { PlayerPing } from './models/player.model';
import { pingPlayers } from './management/players';
import { ServerPing, _SERVER_TYPE } from './models/server.model';
import {
    pingGameServer,
    pingProxyServer,
    publishAllOnlineGameServer,
} from './management/servers';
import { BIND_PORT } from './tools/config';
import { logger } from './tools/logging';
import { appAuth } from './middlewares/auth.middleware';
import {
    checkAuthConfig,
    initializeAccounts,
    initializePermissions,
} from './management/account';
import { RequestError } from './models/error.model';

export const rabbitmq = new RabbitMQ();
const prisma = new PrismaClient();

async function main() {
    logger.info('Starting...');
    await checkAuthConfig();
    await initRabbitMq();
    await initializeAccounts();
    await initializePermissions();
    startExpressServer();
}

function startExpressServer(): void {
    const app = express();

    app.use(cors());
    app.use(appAuth);

    app.use(express.json());

    app.get(`/ping`, async (req, res) => {
        res.json({
            ping: 'pong',
        });
    });

    app.use(require('./routes/server.route'));
    app.use('/serverType', require('./routes/serverType.route'));
    app.use('/player', require('./routes/player.route'));
    app.use('/kpi', require('./routes/kpi.route'));
    app.use('/config', require('./routes/config.route'));
    app.use('/account', require('./routes/accounts.route'));
    app.use('/api_keys', require('./routes/apiKeys.route'));

    app.use(async (error: RequestError, _req: any, res: any, _next: any) => {
        res.status(error.code).json({ message: error.message });
    });

    const server = app.listen(BIND_PORT, async () => {
        logger.info('Start-Up Complete!');
        logger.info(`Server ready at: http://localhost:${BIND_PORT}`);
    });
}

setTimeout(async () => main());

async function initRabbitMq() {
    logger.info('Initializing RabbitMQ');
    await rabbitmq.init();

    await rabbitmq.assertQueue('player-ping');
    await rabbitmq.assertQueue('player-kick', true, {
        'x-queue-type': 'stream',
        'x-max-age': '5m',
    });
    await rabbitmq.assertQueue('server-ping');
    await rabbitmq.assertQueue('game-server-message-broadcast', true, {
        'x-queue-type': 'stream',
        'x-max-age': '1D',
    });
    await rabbitmq.assertQueue('all-online-game-server', true, {
        'x-queue-type': 'stream',
        'x-max-age': '1m',
    });

    await rabbitmq.assertQueue('game-server.maintenance.global', true, {
        'x-queue-type': 'stream',
        'x-max-age': '1D',
    });

    await rabbitmq.assertQueue('proxy-server.maintenance.global', true, {
        'x-queue-type': 'stream',
        'x-max-age': '1D',
    });

    const playerPing$ = rabbitmq.listen('player-ping');
    playerPing$.subscribe((message: PlayerPing) =>
        pingPlayers(message.playerIds)
    );

    const serverPing$ = rabbitmq.listen('server-ping');
    serverPing$.subscribe((message: ServerPing) => {
        if (message.serverType === _SERVER_TYPE.GAME_SERVER)
            pingGameServer(message.id);
        else pingProxyServer(message.id);
    });

    setInterval(async () => await publishAllOnlineGameServer(), 1000);
    logger.info('Initialized RabbitMQ');
}
