import express from 'express';
import {
    getPlayers,
    setPlayerGameServer,
    upsertPlayer,
} from '../management/players';

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
