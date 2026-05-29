'use client';

import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { CommandPalette } from '@/components/CommandPalette';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
    </svg>
  );
}

export function TopNavBar() {
  const t = useTranslations('Nav');
  const { user, loading, signIn, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === 'en' ? 'ko' : 'en' });
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  const avatarUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ||
    (user?.user_metadata?.picture as string | undefined) ||
    null;
  const displayName =
    (user?.user_metadata?.name as string | undefined) ??
    (user?.user_metadata?.user_name as string | undefined) ??
    user?.email ??
    'User';

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50 border-b backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(10, 14, 20, 0.85)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[15px]"
              style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                color: '#0A0E14',
              }}
            >
              H
            </span>
            <span className="font-bold text-[16px] tracking-tight" style={{ color: 'var(--text)' }}>
              HarnessHub
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link href="/explore" className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-2)' }}>
              {t('explore')}
            </Link>
            <Link href="/collections" className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-2)' }}>
              {t('collections')}
            </Link>
            <Link href="/benchmarks" className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-2)' }}>
              {t('benchmarks')}
            </Link>
            <Link href="/docs" className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-2)' }}>
              {t('docs')}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <CommandPalette />
            <Link
              href="/submit"
              className="hidden md:inline-flex text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-2)' }}
            >
              {t('submit')}
            </Link>
            <button
              type="button"
              onClick={toggleLocale}
              className="text-sm font-medium px-2 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-raised)]"
              aria-label="Toggle language"
            >
              <span style={{ color: locale === 'en' ? 'var(--accent)' : 'var(--text-3)' }}>EN</span>
              <span style={{ color: 'var(--text-3)' }}> / </span>
              <span style={{ color: locale === 'ko' ? 'var(--accent)' : 'var(--text-3)' }}>KO</span>
            </button>
            {!loading &&
              (user ? (
                <div className="hidden sm:block relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold cursor-pointer border"
                    style={{
                      borderColor: 'var(--border)',
                      background: avatarUrl
                        ? 'transparent'
                        : 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                      color: '#0A0E14',
                    }}
                    aria-label="Account menu"
                    aria-expanded={menuOpen}
                  >
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </button>
                  {menuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl border shadow-xl overflow-hidden"
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      <div
                        className="px-4 py-3 border-b"
                        style={{ borderColor: 'var(--border-sub)' }}
                      >
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                          {displayName}
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-raised)]"
                        style={{ color: 'var(--text-2)' }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 18, color: 'var(--text-3)' }}
                        >
                          person
                        </span>
                        {t('profile')}
                      </Link>
                      <button
                        type="button"
                        onClick={async () => {
                          setMenuOpen(false);
                          await signOut();
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-raised)] text-left"
                        style={{ color: 'var(--text-2)' }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: 18, color: 'var(--text-3)' }}
                        >
                          logout
                        </span>
                        {t('signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={signIn}
                  className="text-sm font-bold px-3.5 py-1.5 rounded-lg transition-all inline-flex items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                    color: '#0A0E14',
                  }}
                >
                  <GoogleIcon size={15} />
                  {t('signIn')}
                </button>
              ))}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg"
              style={{ color: 'var(--text-2)' }}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu (Drawer) - Moved outside nav to prevent backdrop-blur containment */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-0 z-[60] flex flex-col"
              style={{ backgroundColor: '#0A0E14' }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--border)]">
                <span className="font-bold text-lg" style={{ color: 'var(--text)' }}>Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg"
                  style={{ color: 'var(--text-2)' }}
                  aria-label="Close Menu"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="px-6 py-8 flex flex-col gap-6 text-lg font-medium overflow-y-auto h-full">
                <Link href="/explore" onClick={() => setMobileOpen(false)} className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>
                  {t('explore')}
                </Link>
                <Link href="/collections" onClick={() => setMobileOpen(false)} className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>
                  {t('collections')}
                </Link>
                <Link href="/benchmarks" onClick={() => setMobileOpen(false)} className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>
                  {t('benchmarks')}
                </Link>
                <Link href="/docs" onClick={() => setMobileOpen(false)} className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>
                  {t('docs')}
                </Link>
                
                <hr className="border-[var(--border-sub)] my-2" />

                <Link href="/submit" onClick={() => setMobileOpen(false)} style={{ color: 'var(--accent)' }}>
                  {t('submit')}
                </Link>

                {!loading &&
                  (user ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3"
                        style={{ color: 'var(--text-2)' }}
                      >
                        <span className="material-symbols-outlined">person</span>
                        {t('profile')}
                      </Link>
                      <button
                        onClick={async () => {
                          setMobileOpen(false);
                          await signOut();
                        }}
                        className="flex items-center gap-3 text-left"
                        style={{ color: 'var(--danger)' }}
                      >
                        <span className="material-symbols-outlined">logout</span>
                        {t('signOut')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signIn();
                      }}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 mt-4 rounded-xl font-bold w-full"
                      style={{
                        background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
                        color: '#0A0E14',
                      }}
                    >
                      <GoogleIcon size={18} />
                      {t('signIn')}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      <div className="h-16" aria-hidden />
    </>
  );
}
