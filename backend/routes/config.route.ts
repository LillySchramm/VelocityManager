import express from 'express';
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    RABBIT_MQ_PREFIX,
    RABBIT_MQ_URI,
} from '../tools/config';
const router = express.Router();

router.get(`/rabbitmq`, async (req, res) => {
    const uri = RABBIT_MQ_URI;
    const prefix = RABBIT_MQ_PREFIX;

    res.json({ uri, prefix });
});

router.get(`/firebase`, async (req, res) => {
    res.json({
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        databaseURL: '',
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: '',
        messagingSenderId: '',
    });
});

module.exports = router;
