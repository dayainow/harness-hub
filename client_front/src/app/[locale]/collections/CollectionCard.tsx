'use client';

import { Link } from '@/i18n/routing';
import type { Collection } from '@/lib/api';

export function CollectionCard({
  collection,
  harnessesLabel,
  curatedByLabel,
}: {
  collection: Collection;
  harnessesLabel: string;
  curatedByLabel: string;
}) {
  const curatorName =
    collection.curator?.name ?? collection.curator?.username ?? null;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group relative rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center gap-1 text-[10px] font-mono-code uppercase tracking-wider px-2 py-0.5 rounded-md"
          style={{
            backgroundColor: 'rgba(0, 229, 255, 0.10)',
            color: 'var(--accent)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
            collections_bookmark
          </span>
          Collection
        </span>
        <span
          className="text-[11px] font-mono-code px-2 py-0.5 rounded-md"
          style={{ backgroundColor: 'var(--bg-raised)', color: 'var(--text-2)' }}
        >
          {harnessesLabel}
        </span>
      </div>

      <h2
        className="text-xl font-bold mb-2 leading-tight transition-colors group-hover:text-[var(--accent)]"
        style={{ color: 'var(--text)' }}
      >
        {collection.title}
      </h2>

      <p
        className="text-sm leading-relaxed line-clamp-2 mb-4 grow"
        style={{ color: 'var(--text-2)' }}
      >
        {collection.description}
      </p>

      {curatorName && (
        <div
          className="flex items-center gap-2 pt-3 border-t text-[12px]"
          style={{ borderColor: 'var(--border-sub)', color: 'var(--text-3)' }}
        >
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #A78BFA 100%)',
              color: '#0A0E14',
            }}
          >
            {collection.curator?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={collection.curator.avatarUrl}
                alt={curatorName}
                className="w-full h-full object-cover"
              />
            ) : (
              curatorName.charAt(0).toUpperCase()
            )}
          </span>
          <span className="truncate">
            <span style={{ color: 'var(--text-4)' }}>{curatedByLabel} </span>
            <span style={{ color: 'var(--text-2)' }}>{curatorName}</span>
          </span>
        </div>
      )}
    </Link>
  );
}
