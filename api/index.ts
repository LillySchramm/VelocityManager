import { PrismaClient } from "@prisma/client";
import express from "express";
import basicAuth from "express-basic-auth";
import { setPlayerGameServer, upsertPlayer } from "./management/players";
import {
    getAllOnlineGameServer,
    getAllOnlineProxyServer,
    getGameServer,
    getJoinableServer,
    getProxyServer,
    pingGameServer,
    pingProxyServer,
    registerGameServer,
    registerProxyServer,
} from "./management/servers";
import { getAllServerTypes } from "./management/serverTypes";

const prisma = new PrismaClient();
const app = express();

app.use(
    basicAuth({
        users: { admin: "admin" },
    })
);

app.use(express.json());

app.get(`/ping`, async (req, res) => {
    res.json({
        ping: "pong",
    });
});

app.post(`/ping/proxyServer/:id`, async (req, res) => {
    const id = req.params.id;

    const successful = await pingProxyServer(id);

    res.json({
        ping: "pong",
        successful,
    });
});

app.post(`/ping/gameServer/:id`, async (req, res) => {
    const id = req.params.id;
    const ip: string = req.ip.split(":").pop() || "";
    const port: number = req.body.port;
    const maximumPlayers = req.body.maximumPlayers;

    const successful = await pingGameServer(id, ip, port, maximumPlayers);

    res.json({
        ping: "pong",
        successful,
    });
});

app.put(`/registerGameServer`, async (req, res) => {
    const server = await registerGameServer();

    res.json({ id: server.id, name: server.name });
});

app.put(`/registerProxyServer`, async (req, res) => {
    const server = await registerProxyServer();

    res.json({ id: server.id, name: server.name });
});

app.get(`/gameServer/online`, async (req, res) => {
    const servers = await getAllOnlineGameServer();

    res.json({
        servers: servers.map((server) => {
            return { ...server, lastContact: Number(server?.lastContact) };
        }),
    });
});

app.get(`/gameServer/:id`, async (req, res) => {
    const id = req.params.id;
    const server = await getGameServer(id);

    if (!server) {
        res.status(404);
        res.json({ msg: "Could not find server" });

        return;
    }

    res.json({ ...server, lastContact: Number(server?.lastContact) });
});

app.get(`/proxyServer/online`, async (req, res) => {
    const servers = await getAllOnlineProxyServer();

    res.json({
        servers: servers.map((server) => {
            return { ...server, lastContact: Number(server?.lastContact) };
        }),
    });
});

app.get(`/proxyServer/:id`, async (req, res) => {
    const id = req.params.id;
    const server = await getProxyServer(id);

    if (!server) {
        res.status(404);
        res.json({ msg: "Could not find server" });

        return;
    }

    res.json({ ...server, lastContact: Number(server?.lastContact) });
});

app.get(`/serverType/all`, async (req, res) => {
    const types = await getAllServerTypes();

    res.json({ types });
});

app.get(`/serverType/:id/joinableServer`, async (req, res) => {
    const serverTypeId = req.params.id;
    const server = await getJoinableServer(serverTypeId);

    if (!server) {
        res.json({ found: false });
        return;
    }

    res.json({ found: true, id: server.id, name: server.name });
});

app.put(`/player/createIfNotExistent`, async (req, res) => {
    const id: string = req.body.id;
    const name: string = req.body.name;

    const player = await upsertPlayer(id, name);

    res.json({ ...player, lastContact: Number(player.lastContact) });
});

app.post(`/player/:id/join`, async (req, res) => {
    const playerId: string = req.params.id;
    const serverId: string = req.body.serverId;

    const player = await setPlayerGameServer(playerId, serverId);

    res.json({ success: !!player });
});

const server = app.listen(30001, () =>
    console.log(`🚀 Server ready at: http://localhost:30001`)
);
