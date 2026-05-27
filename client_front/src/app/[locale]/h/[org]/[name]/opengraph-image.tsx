import { ImageResponse } from 'next/og';
import { getHarness, CATEGORY_META } from '@/lib/api';

export const runtime = 'edge';
export const alt = 'HarnessHub OG Image';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ org: string; name: string }> }) {
  const { org, name } = await params;
  const harness = await getHarness(org, name);

  if (!harness) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#0A0E14', color: '#fff', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
          Harness Not Found
        </div>
      ),
      { ...size }
    );
  }

  const meta = CATEGORY_META[harness.category];

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#0A0E14',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'auto' }}>
          <div
            style={{
              display: 'flex',
              padding: '12px 24px',
              borderRadius: '999px',
              border: '2px solid rgba(0, 229, 255, 0.3)',
              backgroundColor: 'rgba(0, 229, 255, 0.1)',
              color: '#00E5FF',
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {meta?.label || 'HarnessHub'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              margin: '0 0 24px 0',
              lineHeight: 1.1,
              color: '#ffffff',
            }}
          >
            {harness.orgName} / <span style={{ color: '#A78BFA', marginLeft: 16 }}>{harness.name}</span>
          </h1>

          <p
            style={{
              fontSize: 32,
              color: '#8A94A6',
              margin: '0 0 48px 0',
              lineHeight: 1.4,
              maxWidth: '900px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {harness.description}
          </p>

          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 32 }}>
              <span style={{ color: '#FBBF24' }}>★</span>
              <span style={{ fontWeight: 700 }}>{harness.stars.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 32, color: '#8A94A6' }}>
              <span style={{ fontWeight: 700 }}>{harness.downloadsCount.toLocaleString()}</span>
              <span>installs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: 24, color: '#8A94A6' }}>
              <span style={{ padding: '8px 16px', backgroundColor: '#1A212E', borderRadius: '12px' }}>
                {harness.license || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
