import { PrismaClient } from "@prisma/client";
import express from "express";
import basicAuth from 'express-basic-auth';
import { pingGameServer, pingProxyServer, registerGameServer, registerProxyServer } from "./management/servers";

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

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`),
);