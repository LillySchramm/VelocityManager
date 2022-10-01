import express from 'express';
import { rabbitmq } from '..';
import {
    getPlayers,
    logKick,
    setPlayerGameServer,
    upsertPlayer,
} from '../management/players';
import { DEFAULT_KICK_MESSAGE } from '../tools/config';

const router = express.Router();

router.put(`/createIfNotExistent`, async (req, res) => {
    const id: string = req.body.id;
    const name: string = req.body.name;

    const player = await upsertPlayer(id, name);

    res.json({ ...player, lastContact: Number(player.lastContact) });
});

router.post(`/:id/join`, async (req, res) => {
    const playerId: string = req.params.id;
    const serverId: string = req.body.serverId;

    const player = await setPlayerGameServer(playerId, serverId);

    res.json({ success: !!player });
});

router.post(`/:id/kick`, async (req, res) => {
    const playerId: string = req.params.id;
    const reason: string = req.body.reason || DEFAULT_KICK_MESSAGE;

    rabbitmq.sendMessage(
        'player-kick',
        JSON.stringify({
            playerId,
            reason,
        })
    );

    logKick(playerId, reason);

    res.json({ playerId, reason });
});

router.get(`/all`, async (req, res) => {
    const players = (await getPlayers()).map((playerStatus) => {
        return {
            ...playerStatus.player,
            lastContact: Number(playerStatus.player.lastContact),
            online: playerStatus.online,
        };
    });
    res.json({ players });
});

module.exports = router;
