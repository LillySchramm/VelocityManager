import express from "express";
import { getJoinableServer } from "../management/servers";
import { getAllServerTypes } from "../management/serverTypes";
const router = express.Router();

router.get(`/all`, async (req, res) => {
    const types = await getAllServerTypes();

    res.json({ types });
});

router.get(`/:id/joinableServer`, async (req, res) => {
    const serverTypeId = req.params.id;
    const server = await getJoinableServer(serverTypeId);

    if (!server) {
        res.json({ found: false });
        return;
    }

    res.json({ found: true, id: server.id, name: server.name });
});

module.exports = router;
