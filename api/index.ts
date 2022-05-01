import { PrismaClient } from "@prisma/client";
import express from "express";
import basicAuth from 'express-basic-auth';
import {
    getAllOnlineGameServer,
    getAllOnlineProxyServer,
    getGameServer,
    getProxyServer,
    pingGameServer,
    pingProxyServer,
    registerGameServer,
    registerProxyServer
} from "./management/servers";

const prisma = new PrismaClient();
const app = express();

app.use(basicAuth({
    users: { 'admin': 'admin' }
}))

app.use(express.json());

app.get(`/ping`, async (req, res) => {
    res.json({
        ping: "pong"
    });
});

app.get(`/ping/proxyServer/:id`, async (req, res) => {
    const id = req.params.id;

    const successful = await pingProxyServer(id);

    res.json({
        ping: "pong",
        successful
    });
});

app.get(`/ping/gameServer/:id`, async (req, res) => {
    const id = req.params.id;

    const successful = await pingGameServer(id);

    res.json({
        ping: "pong",
        successful
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
            return { ...server, lastContact: Number(server?.lastContact) }
        })
    });
});

app.get(`/gameServer/:id`, async (req, res) => {
    const id = req.params.id;
    const server = await getGameServer(id);

    if (!server) {
        res.status(404)
        res.json({ msg: "Could not find server" })

        return;
    }

    res.json({ ...server, lastContact: Number(server?.lastContact) });
});

app.get(`/proxyServer/online`, async (req, res) => {
    const servers = await getAllOnlineProxyServer();

    res.json({
        servers: servers.map((server) => {
            return { ...server, lastContact: Number(server?.lastContact) }
        })
    });
});

app.get(`/proxyServer/:id`, async (req, res) => {
    const id = req.params.id;
    const server = await getProxyServer(id);

    if (!server) {
        res.status(404)
        res.json({ msg: "Could not find server" })

        return;
    }

    res.json({ ...server, lastContact: Number(server?.lastContact) });
});

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`),
);