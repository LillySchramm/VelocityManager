import express from 'express';
import { rabbitmq } from '..';
import {
    getAllOnlineGameServer,
    getAllOnlineProxyServer,
    getGameServer,
    getProxyServer,
    registerGameServer,
    registerProxyServer,
    updateGameServer,
} from '../management/servers';
import {
    MaintenanceCommand,
    MaintenanceMessage,
} from '../models/maintenance.model';
const router = express.Router();

router.get(`/proxyServer/online`, async (req, res) => {
    const servers = await getAllOnlineProxyServer();

    res.json({
        servers: servers.map((server) => {
            return { ...server, lastContact: Number(server?.lastContact) };
        }),
    });
});

router.get(`/proxyServer/:id`, async (req, res) => {
    const id = req.params.id;
    const server = await getProxyServer(id);

    if (!server) {
        res.status(404);
        res.json({ msg: 'Could not find server' });

        return;
    }

    res.json({ ...server, lastContact: Number(server?.lastContact) });
});

router.post(`/proxyServer/global/maintenance`, async (req, res) => {
    const command = req.query.command;
    if (
        !command ||
        typeof command !== 'string' ||
        !(command in MaintenanceCommand)
    ) {
        res.status(400).json({ error: 'Unknown command.' });
        return;
    }
    const message: MaintenanceMessage = {
        command: command as MaintenanceCommand,
    };

    rabbitmq.sendMessage(
        'proxy-server.maintenance.global',
        JSON.stringify(message)
    );

    res.json({ message });
});

router.post(`/gameServer/update/:id`, async (req, res) => {
    const id = req.params.id;
    const ip: string = req.ip.split(':').pop() || '';
    const port: number = req.body.port;
    const maximumPlayers = req.body.maximumPlayers;

    const successful = await updateGameServer(id, ip, port, maximumPlayers);

    res.json({
        ping: 'pong',
        successful,
    });
});

router.post(`/gameServer/global/maintenance`, async (req, res) => {
    const command = req.query.command;
    if (
        !command ||
        typeof command !== 'string' ||
        !(command in MaintenanceCommand)
    ) {
        res.status(400).json({ error: 'Unknown command.' });
        return;
    }
    const message: MaintenanceMessage = {
        command: command as MaintenanceCommand,
    };

    rabbitmq.sendMessage(
        'game-server.maintenance.global',
        JSON.stringify(message)
    );

    res.json({ message });
});

router.put(`/registerGameServer`, async (req, res) => {
    const server = await registerGameServer();

    res.json({ id: server.id, name: server.name });
});

router.put(`/registerProxyServer`, async (req, res) => {
    const server = await registerProxyServer();

    res.json({ id: server.id, name: server.name });
});

router.get(`/gameServer/online`, async (req, res) => {
    const servers = await getAllOnlineGameServer();

    res.json({
        servers: servers.map((server) => {
            return { ...server, lastContact: Number(server?.lastContact) };
        }),
    });
});

router.get(`/gameServer/:id`, async (req, res) => {
    const id = req.params.id;
    const server = await getGameServer(id);

    if (!server) {
        res.status(404);
        res.json({ msg: 'Could not find server' });

        return;
    }

    res.json({ ...server, lastContact: Number(server?.lastContact) });
});

router.put(`/gameServer/all/message`, async (req, res) => {
    const message: string = req.body.message;
    rabbitmq.sendMessage(
        'game-server-message-broadcast',
        JSON.stringify({ message })
    );

    res.json({ done: true });
});

module.exports = router;
