import express from 'express';
import { getPlayerKPIs } from '../management/players';
import { getGameServerKPIs, getProxyServerKPIs } from '../management/servers';

const router = express.Router();

router.get(`/all`, async (req, res) => {
    const players = await getPlayerKPIs();
    const gameServer = await getGameServerKPIs();
    const proxyServer = await getProxyServerKPIs();

    res.json({ players, gameServer, proxyServer });
});

router.get(`/players`, async (req, res) => {
    const players = await getPlayerKPIs();

    res.json({ ...players });
});

router.get(`/gameServer`, async (req, res) => {
    const gameServer = await getGameServerKPIs();

    res.json({ ...gameServer });
});

router.get(`/proxyServer`, async (req, res) => {
    const proxyServer = await getProxyServerKPIs();

    res.json({ ...proxyServer });
});

module.exports = router;
