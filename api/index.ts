import { PrismaClient } from "@prisma/client";
import express from "express";
import basicAuth from 'express-basic-auth';

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

const server = app.listen(3000, () =>
    console.log(`🚀 Server ready at: http://localhost:3000`),
);