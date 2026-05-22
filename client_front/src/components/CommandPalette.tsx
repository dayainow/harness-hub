'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/routing';
import { API_BASE } from '@/lib/api';

interface SuggestItem {
  slug: string;
  name: string;
  orgName: string;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SuggestItem[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/search/suggest?q=${encodeURIComponent(query)}`, {
          signal: ctrl.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data?.harnesses) ? data.harnesses : []);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timeout);
      ctrl.abort();
    };
  }, [query]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const handleSelect = (slug: string) => {
    router.push(`/h/${slug}`);
    close();
  };

  const handleGlobalSearch = () => {
    if (query.trim()) {
      router.push(`/explore?search=${encodeURIComponent(query)}`);
      close();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border)',
          color: 'var(--text-3)',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
          search
        </span>
        <span>Search harnesses…</span>
        <kbd
          className="ml-2 px-1.5 py-0.5 text-[10px] font-mono-code rounded border"
          style={{
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--border)',
            color: 'var(--text-3)',
          }}
        >
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 backdrop-blur-md"
              style={{ backgroundColor: 'rgba(10, 14, 20, 0.75)' }}
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden border shadow-2xl z-10"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center px-4 border-b" style={{ borderColor: 'var(--border-sub)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--text-3)' }}>
                  search
                </span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') close();
                    if (e.key === 'Enter') handleGlobalSearch();
                  }}
                  placeholder="Search harnesses, orgs, tags..."
                  className="flex-1 bg-transparent px-3 py-4 outline-none text-base"
                  style={{ color: 'var(--text)' }}
                />
                <kbd
                  className="px-1.5 py-0.5 text-[10px] font-mono-code rounded border"
                  style={{
                    backgroundColor: 'var(--bg)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-3)',
                  }}
                >
                  ESC
                </kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {!query.trim() && (
                  <div className="px-4 py-6 text-center text-sm" style={{ color: 'var(--text-3)' }}>
                    <p className="mb-3 font-mono-code text-[11px] uppercase tracking-widest">Try</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['SWE-agent', 'aider', 'cline', 'claude-code', 'openhands'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setQuery(t)}
                          className="px-2.5 py-1 rounded-md text-xs font-mono-code transition-colors"
                          style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-2)' }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-3)' }}>
                    Searching...
                  </div>
                )}

                {!loading && query && results.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--text-3)' }}>
                    No harnesses found.
                    <button
                      onClick={handleGlobalSearch}
                      className="block mt-2 mx-auto text-xs"
                      style={{ color: 'var(--accent)' }}
                    >
                      Search &quot;{query}&quot; across catalog →
                    </button>
                  </div>
                )}

                {!loading && results.length > 0 && (
                  <div className="py-2">
                    {results.map((r) => (
                      <button
                        key={r.slug}
                        onClick={() => handleSelect(r.slug)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left"
                        style={{ color: 'var(--text)' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-raised)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 18, color: 'var(--accent)' }}
                          >
                            extension
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                              {r.orgName}/{r.name}
                            </p>
                            <p className="text-[11px] font-mono-code" style={{ color: 'var(--text-3)' }}>
                              {r.category}
                            </p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--text-4)' }}>
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
