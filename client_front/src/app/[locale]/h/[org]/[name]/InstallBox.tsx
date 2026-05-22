'use client';

import { useState } from 'react';
import type { Harness } from '@/lib/api';

export function InstallBox({ harness }: { harness: Harness }) {
  const [copied, setCopied] = useState(false);
  const installCmd = harness.installCmd ?? `pip install ${harness.name.toLowerCase()}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <p
        className="font-mono-code text-xs mb-3 truncate"
        style={{ color: 'var(--text-3)' }}
      >
        {harness.slug}
      </p>
      <div
        className="flex items-center gap-2 rounded-lg border px-3 py-2.5 mb-3"
        style={{
          backgroundColor: 'var(--bg)',
          borderColor: 'var(--border-sub)',
        }}
      >
        <span className="font-mono-code text-sm" style={{ color: 'var(--accent)' }}>
          $
        </span>
        <code
          className="font-mono-code text-sm flex-1 truncate"
          style={{ color: 'var(--text)' }}
        >
          {installCmd}
        </code>
        <button
          onClick={copy}
          className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-2)' }}
          aria-label="Copy install command"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {copied ? 'check' : 'content_copy'}
          </span>
        </button>
      </div>

      <div className="flex gap-2">
        <button
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'var(--bg-raised)',
            borderColor: 'var(--border)',
            color: 'var(--text)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            bookmark_border
          </span>
          Bookmark
        </button>
        <a
          href={harness.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all"
          style={{
            background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
            color: '#0A0E14',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            open_in_new
          </span>
          GitHub
        </a>
      </div>
    </div>
  );
}
