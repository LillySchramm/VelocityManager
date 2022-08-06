import express from 'express';
import {
    getAccountByName,
    getAccountByNameWithInitialSecret,
    setTOTP,
} from '../management/accounts';
import { logger } from '../tools/logging';
import { getRandomString64 } from '../tools/random';
import { generateTOTP, verifyTOTP } from '../tools/totp';

const router = express.Router();

router.post(`/login`, async (req, res) => {
    const { name, otp } = req.body;
    const OTP_REGEX = /^\d{6}$/gm;

    const account = await getAccountByName(name);

    if (!account) {
        res.sendStatus(401);
        return;
    }

    if (!account.otp) {
        const accountWithInitialSecret =
            await getAccountByNameWithInitialSecret(name);

        if (
            !accountWithInitialSecret ||
            accountWithInitialSecret?.initialSecret?.key !== otp
        ) {
            res.sendStatus(401);
            return;
        }

        const totp = generateTOTP(accountWithInitialSecret);
        await setTOTP(accountWithInitialSecret, totp);

        res.json({ totp: totp.toString() });
        return;
    }

    if (!OTP_REGEX.test(otp) || !verifyTOTP(account.otp.dataUri, otp)) {
        res.sendStatus(401);

        return;
    }

    logger.verbose(`${account.name} logged in successfully.`);

    res.json({ bearer: getRandomString64(256) }); // Placeholder
});
module.exports = router;
