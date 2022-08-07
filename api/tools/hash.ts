import { hash } from 'bcrypt';

const SALT_ROUNDS = 13;

export async function secureHash(value: string): Promise<string> {
    return hash(value, SALT_ROUNDS);
}
