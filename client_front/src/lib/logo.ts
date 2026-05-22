const TOKEN = 'pk_HqFdbQC2T_GqjA12c910QQ';

export function getLogoUrl(iconUrl?: string | null): string | undefined {
  if (!iconUrl) return undefined;
  const m = iconUrl.match(/logo\.clearbit\.com\/([^?#]+)/);
  if (m) return `https://img.logo.dev/${m[1]}?token=${TOKEN}`;
  if (iconUrl.includes('img.logo.dev')) return iconUrl;
  return iconUrl;
}
