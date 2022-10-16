import express from 'express';
import { RABBIT_MQ_PREFIX, RABBIT_MQ_URI } from '../tools/config';
const router = express.Router();

router.get(`/rabbitmq`, async (req, res) => {
    const uri = RABBIT_MQ_URI;
    const prefix = RABBIT_MQ_PREFIX;

    res.json({ uri, prefix });
});

module.exports = router;
