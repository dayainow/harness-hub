'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { CommandPalette } from '@/components/CommandPalette';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54v-2.05c-3.13.68-3.79-1.32-3.79-1.32-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1.01 1.72 2.64 1.22 3.28.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.58 0-1.23.44-2.24 1.16-3.03-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.11 1.16.9-.25 1.86-.37 2.83-.38.96 0 1.93.13 2.83.38 2.16-1.46 3.11-1.16 3.11-1.16.61 1.55.23 2.7.11 2.98.72.79 1.16 1.8 1.16 3.03 0 4.34-2.64 5.29-5.15 5.57.4.34.76 1.02.76 2.05v3.04c0 .3.2.65.78.54 4.47-1.5 7.68-5.7 7.68-10.67C23.25 5.48 18.27.5 12 .5z" />
    </svg>
  );
}

export function TopNavBar() {
  const t = useTranslations('Nav');
  const { user, loading, signIn, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
                  <GitHubIcon size={15} />
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

        {/* Mobile menu (Drawer) */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-0 z-[60] bg-[var(--bg)]/95 backdrop-blur-xl flex flex-col"
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
                      <GitHubIcon size={18} />
                      {t('signIn')}
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-16" aria-hidden />
    </>
  );
}
