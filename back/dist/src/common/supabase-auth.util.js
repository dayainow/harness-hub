"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySupabaseJwt = verifySupabaseJwt;
const crypto = __importStar(require("crypto"));
const https = __importStar(require("https"));
const jwt = __importStar(require("jsonwebtoken"));
const common_1 = require("@nestjs/common");
const JWKS_URI = 'https://yrtmuhuzqdfheymulrjd.supabase.co/auth/v1/.well-known/jwks.json';
let jwksCache = new Map();
let jwksCacheExpiry = 0;
function fetchJwks() {
    return new Promise((resolve, reject) => {
        https
            .get(JWKS_URI, (res) => {
            let raw = '';
            res.on('data', (chunk) => (raw += chunk));
            res.on('end', () => {
                try {
                    const { keys } = JSON.parse(raw);
                    const next = new Map();
                    for (const jwk of keys) {
                        next.set(jwk.kid, crypto.createPublicKey({ key: jwk, format: 'jwk' }));
                    }
                    jwksCache = next;
                    jwksCacheExpiry = Date.now() + 3_600_000;
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            });
        })
            .on('error', reject);
    });
}
async function getPublicKey(kid) {
    if (Date.now() > jwksCacheExpiry || !jwksCache.has(kid)) {
        await fetchJwks();
    }
    return jwksCache.get(kid) ?? null;
}
async function verifySupabaseJwt(token) {
    try {
        const decoded = jwt.decode(token, { complete: true });
        const kid = decoded?.header?.kid;
        if (kid) {
            const publicKey = await getPublicKey(kid);
            if (publicKey) {
                const payload = jwt.verify(token, publicKey, {
                    algorithms: ['ES256', 'RS256'],
                });
                const email = payload.email ??
                    payload.user_metadata?.email;
                if (email && payload.sub) {
                    return { email: email, sub: payload.sub };
                }
            }
        }
    }
    catch {
    }
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (secret?.trim()) {
        try {
            const payload = jwt.verify(token, secret);
            const email = payload.email ??
                payload.user_metadata?.email;
            if (email && payload.sub) {
                return { email: email, sub: payload.sub };
            }
        }
        catch {
        }
    }
    throw new common_1.UnauthorizedException('Invalid or expired token.');
}
//# sourceMappingURL=supabase-auth.util.js.map