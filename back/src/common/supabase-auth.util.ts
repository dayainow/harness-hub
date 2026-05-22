import * as crypto from 'crypto';
import * as https from 'https';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';

const JWKS_URI =
  'https://yrtmuhuzqdfheymulrjd.supabase.co/auth/v1/.well-known/jwks.json';

// In-memory JWKS cache (kid → KeyObject)
let jwksCache = new Map<string, crypto.KeyObject>();
let jwksCacheExpiry = 0;

function fetchJwks(): Promise<void> {
  return new Promise((resolve, reject) => {
    https
      .get(JWKS_URI, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const { keys } = JSON.parse(raw) as { keys: (Record<string, unknown> & { kid: string })[] };
            const next = new Map<string, crypto.KeyObject>();
            for (const jwk of keys) {
              next.set(jwk.kid, crypto.createPublicKey({ key: jwk as crypto.JsonWebKeyInput['key'], format: 'jwk' }));
            }
            jwksCache = next;
            jwksCacheExpiry = Date.now() + 3_600_000; // 1 hour
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

async function getPublicKey(kid: string): Promise<crypto.KeyObject | null> {
  if (Date.now() > jwksCacheExpiry || !jwksCache.has(kid)) {
    await fetchJwks();
  }
  return jwksCache.get(kid) ?? null;
}

/**
 * Supabase JWT 검증 — 새 ECDSA Signing Key 우선, Legacy HMAC 시크릿 폴백.
 * 성공 시 { email, sub } 반환, 실패 시 UnauthorizedException throw.
 */
export async function verifySupabaseJwt(
  token: string,
): Promise<{ email: string; sub: string }> {
  // 1) Try JWKS (new EC signing key)
  try {
    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded?.header?.kid as string | undefined;
    if (kid) {
      const publicKey = await getPublicKey(kid);
      if (publicKey) {
        const payload = jwt.verify(token, publicKey, {
          algorithms: ['ES256', 'RS256'],
        }) as jwt.JwtPayload;
        const email =
          payload.email ??
          (payload.user_metadata as { email?: string } | undefined)?.email;
        if (email && payload.sub) {
          return { email: email as string, sub: payload.sub };
        }
      }
    }
  } catch {
    // fall through to legacy
  }

  // 2) Fallback: Legacy HMAC secret
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (secret?.trim()) {
    try {
      const payload = jwt.verify(token, secret) as jwt.JwtPayload;
      const email =
        payload.email ??
        (payload.user_metadata as { email?: string } | undefined)?.email;
      if (email && payload.sub) {
        return { email: email as string, sub: payload.sub };
      }
    } catch {
      // fall through
    }
  }

  throw new UnauthorizedException('Invalid or expired token.');
}
