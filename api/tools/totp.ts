import { Account } from '@prisma/client';
import { TOTP, URI } from 'otpauth';
import { TOTP_ISSUER } from './config';
import { getRandomString32 } from './random';

export function generateTOTP(account: Account): TOTP {
    return new TOTP({
        issuer: TOTP_ISSUER,
        label: account.name,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: getRandomString32(128),
    });
}

export function verifyTOTP(totpUri: string, otp: string): boolean {
    const totp = URI.parse(totpUri);
    return (
        totp.validate({
            token: otp,
            window: 1,
        }) === 0
    );
}
