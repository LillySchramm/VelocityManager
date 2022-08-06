import { Account, InitialSecret, OTP, PrismaClient } from '@prisma/client';
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
