import { PrismaClient } from '@prisma/client';
import express from 'express';
import basicAuth from 'express-basic-auth';
import cors from 'cors';

const prisma = new PrismaClient();
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

const server = app.listen(30001, () =>
    console.log(`🚀 Server ready at: http://localhost:30001`)
);
