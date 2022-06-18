import express from 'express';
import { env } from 'process';
const router = express.Router();

router.get(`/rabbitmq`, async (req, res) => {
    const url = env.RABBIT_MQ_URL || '';

    res.json({ url });
});

module.exports = router;
