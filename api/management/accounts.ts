import {
    Account,
    InitialSecret,
    OTP,
    PrismaClient,
    Session,
} from '@prisma/client';
import { TOTP } from 'otpauth';
import { secureHash } from '../tools/hash';
import { logger } from '../tools/logging';
import { getRandomString64 } from '../tools/random';

const prisma = new PrismaClient();

export async function getAccountCount(): Promise<number> {
    return await prisma.account.count();
}

export async function getAccountByName(
    name: string
): Promise<(Account & { otp: OTP | null }) | null> {
    return await prisma.account.findFirst({
        where: { name },
        include: { otp: true },
    });
}

export async function getAccountByNameWithInitialSecret(
    name: string
): Promise<(Account & { initialSecret: InitialSecret | null }) | null> {
    return await prisma.account.findFirst({
        where: { name },
        include: { initialSecret: true },
    });
}

export async function createNewAccount(
    name: string
): Promise<Account & { initialSecret: InitialSecret | null }> {
    return await prisma.account.create({
        data: {
            name,
            initialSecret: {
                create: {
                    key: getRandomString64(5),
                },
            },
        },
        include: {
            initialSecret: true,
        },
    });
}

export async function setTOTP(account: Account, totp: TOTP): Promise<void> {
    await prisma.account.update({
        where: { id: account.id },
        data: {
            //initialSecretId: null,
            otp: {
                create: {
                    dataUri: totp.toString(),
                },
            },
        },
    });

    logger.verbose(`Set new TOTP for '${account.name}'.`);
}

export async function generateNewSession(
    account: Account
): Promise<Session & { bearer: string }> {
    const bearer = getRandomString64(512);
    const hash = await secureHash(bearer);

    const session = await prisma.session.create({
        data: {
            key: hash,
            accountId: account.id,
        },
    });

    return { ...session, bearer };
}
