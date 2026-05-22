import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export const proxy = createMiddleware(routing);

export const config = {
  matcher: [
    // Match all paths except api, Next.js internals, auth routes (Supabase OAuth), and static files
    '/((?!api|_next|_vercel|auth|.*\\..*).*)',
  ],
};
