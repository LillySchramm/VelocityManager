export interface PingResponse {
    ping: string;
}

export interface LoginResponse {
    bearer?: string;
    totp?: string;
}
