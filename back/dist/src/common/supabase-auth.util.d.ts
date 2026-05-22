export declare function verifySupabaseJwt(token: string): Promise<{
    email: string;
    sub: string;
}>;
