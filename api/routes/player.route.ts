import express from 'express';
import { setPlayerGameServer, upsertPlayer } from '../management/players';

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

module.exports = router;
