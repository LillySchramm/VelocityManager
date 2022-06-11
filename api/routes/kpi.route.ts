import express from 'express';
import { getPlayerKPIs } from '../management/players';

const router = express.Router();

router.get(`/all`, async (req, res) => {
    const players = await getPlayerKPIs();

    res.json({ players });
});

router.get(`/players`, async (req, res) => {
    const players = await getPlayerKPIs();

    res.json({ ...players });
});

module.exports = router;
