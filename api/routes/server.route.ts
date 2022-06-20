import express from 'express';
import { rabbitmq } from '..';
import { pingPlayers } from '../management/players';
import {
    getAllOnlineGameServer,
    getAllOnlineProxyServer,
    getGameServer,
    getProxyServer,
    pingGameServer,
    pingProxyServer,
    registerGameServer,
    registerProxyServer,
} from '../management/servers';
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

router.post(`/ping/proxyServer/:id`, async (req, res) => {
    const id = req.params.id;

    const successful = await pingProxyServer(id);

    res.json({
        ping: 'pong',
        successful,
    });
});

router.post(`/ping/gameServer/:id`, async (req, res) => {
    const id = req.params.id;
    const ip: string = req.ip.split(':').pop() || '';
    const port: number = req.body.port;
    const maximumPlayers = req.body.maximumPlayers;
    const players: string[] = req.body.players || [];

    const successful = await pingGameServer(id, ip, port, maximumPlayers);
    await pingPlayers(players);

    res.json({
        ping: 'pong',
        successful,
    });
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
