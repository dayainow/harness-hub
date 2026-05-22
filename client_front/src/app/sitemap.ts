import { MetadataRoute } from 'next';
import { getHarnesses } from '@/lib/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://harnesshub.dev';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/ko/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/en/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/ko/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const list = await getHarnesses({ limit: 100, sort: 'recent' });
    for (const h of list.items) {
      const [org, name] = h.slug.split('/');
      out.push({
        url: `${SITE_URL}/ko/h/${org}/${name}`,
        lastModified: h.updatedAt ? new Date(h.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch {
    /* ignore */
  }

  return out;
}
