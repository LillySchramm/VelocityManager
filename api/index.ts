import { PrismaClient } from '@prisma/client';
import express from 'express';
import basicAuth from 'express-basic-auth';
import cors from 'cors';
import { RabbitMQ } from './rabbitmq/rabbitmq';
import { PlayerPing } from './models/player.model';
import { pingPlayers } from './management/players';

export const rabbitmq = new RabbitMQ();
const prisma = new PrismaClient();

async function main() {
    await rabbitmq.init();

    await rabbitmq.assertQueue('player-ping');
    await rabbitmq.assertQueue('game-server-message-broadcast', true, {
        'x-queue-type': 'stream',
        'x-max-age': '1D',
    });

    const playerPing$ = rabbitmq.listen('player-ping');
    playerPing$.subscribe((message) => {
        const playerPingMessage = JSON.parse(message) as PlayerPing;
        pingPlayers(playerPingMessage.playerIds);
    });

    startExpressServer();
}

function startExpressServer(): void {
    const app = express();

    app.use(cors());
    app.use(
        basicAuth({
            users: { admin: 'admin' },
        })
    );

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

    const server = app.listen(30001, async () => {
        console.log(`🚀 Server ready at: http://localhost:30001`);
    });
}

setTimeout(async () => main());
