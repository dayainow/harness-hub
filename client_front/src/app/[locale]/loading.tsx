export default function Loading() {
  return (
    <div className="min-h-screen px-6 py-12" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 space-y-3">
          <div
            className="h-8 w-64 rounded-lg animate-pulse"
            style={{ backgroundColor: 'var(--bg-card)' }}
          />
          <div
            className="h-4 w-96 rounded animate-pulse"
            style={{ backgroundColor: 'var(--bg-card)' }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 border animate-pulse"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl shrink-0"
                  style={{ backgroundColor: 'var(--bg-raised)' }}
                />
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--bg-raised)' }} />
                  <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--bg-raised)' }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 rounded" style={{ backgroundColor: 'var(--bg-raised)' }} />
                <div className="h-3 rounded w-5/6" style={{ backgroundColor: 'var(--bg-raised)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
